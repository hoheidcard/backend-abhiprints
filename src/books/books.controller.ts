import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';    // Add this import
import * as AdmZip from 'adm-zip';
import { lstatSync, readFileSync, rmSync } from 'fs';
import { Express } from 'express';         // Import Express types

import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { DefaultStatusPaginationDto } from '../common/dto/pagination-with-default-status.dto';
import { PermissionAction, UserRole } from '../enum';
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from '../utils/fileUpload.utils';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('multi/:organizationDetailId/:settingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'book'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),  // Use memoryStorage to access file.buffer
    }),
  )
  async createMulti(
    @Param('organizationDetailId') organizationDetailId: string,
    @Param('settingId') settingId: string,
    @UploadedFile() file: Express.Multer.File,    // Change type here
    @CurrentUser() user: Account,
  ) {
    let csvFilePath = null;
    const originalName = file.originalname.replace('.zip', '');
    const zip = new AdmZip(file.buffer);
    const uploadFolder = './uploads/' + Date.now();
    const imageLink = organizationDetailId + '/books/';
    await zip.extractAllTo(uploadFolder, true);
    zip.getEntries().map(async (entry) => {
      const filePath = `${uploadFolder}/${entry.entryName}`;
      if (entry.entryName.toLowerCase().endsWith('.csv')) {
        csvFilePath = filePath;
      } else {
        const dirFilePath = filePath.replace('./', '');
        if (!lstatSync(dirFilePath).isDirectory()) {
          try {
            const fileStream = await readFileSync(dirFilePath);
            const fileName = entry.entryName.replace(originalName + '/', '');
            const [name, fileExtension] = fileName.split('.'); // Split file name and extension
            uploadFileHandler(imageLink + name + '.webp', fileStream);
          } catch (e) {}
        }
      }
    });
    const csvData = await this.readCSVData(
      csvFilePath,
      imageLink,
      settingId,
      organizationDetailId,
      user.id,
    );
    rmSync(uploadFolder, {
      recursive: true,
      force: true,
    });
    return csvData;
  }

  async readCSVData(
    filePath: string,
    link: string,
    settingId: string,
    organizationDetailId: string,
    updatedId: string,
  ): Promise<any> {
    const result = { new: 0, old: 0 };
    const categoryList = await this.booksService.findCategory(settingId);
    return new Promise(async (resolve, reject) => {
      const data: any[] = [];
      const content = readFileSync(filePath, { encoding: 'utf-8' });

      // Parse CSV data from buffer
      const lines = content.split('\n');
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const values = line.split(',');
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || null;
            if (header === 'Book Photo Number') {
              rowData['image'] = values[index]
                ? process.env.HOC_CDN_LINK +
                  link +
                  rowData['Book Photo Number'] +
                  '.webp'
                : null;
              rowData['imageName'] = values[index]
                ? link + rowData['Book Photo Number'] + '.webp'
                : null;
            }
          });
          rowData['settingId'] = settingId;
          rowData['name'] = rowData['Book Name'];
          rowData['shortDesc'] = rowData['Short Desc'];
          rowData['author'] = rowData['Book Author'];
          rowData['Book Code'] = rowData['Book Code'];
          rowData['categoryId'] = null;
          rowData['updatedId'] = updatedId;
          rowData['organizationDetailId'] = organizationDetailId;
          const categoryId = categoryList.find(
            (classItem) => classItem.name === rowData['Category Name'],
          );
          if (categoryId) {
            rowData['categoryId'] = categoryId.id;
          }
          const payload = await this.booksService.createCSV(
            rowData,
            organizationDetailId,
            settingId,
          );
          if (payload === 'New') {
            result.new = result.new + 1;
          }
          if (payload === 'Old') {
            result.old = result.old + 1;
          }

          data.push(rowData);
        }
      }
      resolve(result);
    });
  }

  private parseDate(dateString: string): Date {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('.').map(Number);
    // Months are 0-indexed in JavaScript Date objects, so subtract 1 from the month
    return new Date(year, month - 1, day);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'book'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),       // Use memoryStorage here
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,   // Correct type here
    @Body() dto: BookDto,
    @CurrentUser() user: Account,
  ) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    const fileName = 'books/images/' + Date.now() + '.webp';
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        'File not uploaded. Try after some time!',
      );
    }
    dto.image = process.env.HOC_CDN_LINK + fileName;
    dto.imageName = fileName;
    return this.booksService.create(dto);
  }

  @Get('all/:organizationDetailId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'book'])
  findAll(
    @Param('organizationDetailId') organizationDetailId: string,
    @Query() query: DefaultStatusPaginationDto,
  ) {
    return this.booksService.findAll(organizationDetailId, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'book'])
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'book'])
  update(
    @Param('id') id: string,
    @Body() dto: BookDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.booksService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'book'])
  remove(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.booksService.status(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'book'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),       // Use memoryStorage here as well
      fileFilter: imageFileFilter,
    }),
  )
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,    // Correct type here
    @CurrentUser() user: Account,
  ) {
    const fileData = await this.booksService.findOne(id);
    if (fileData.imageName) {
      await deleteFileHandler(fileData.imageName);
    }
    const fileName = 'books/images/' + Date.now() + '.webp';
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        'File not uploaded. Try after some time!',
      );
    }
    return this.booksService.image(fileName, fileData);
  }
}
