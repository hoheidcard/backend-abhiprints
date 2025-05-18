import {
  Body,
  Controller,
  Delete,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express'; 
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DocumentDto } from '../common/dto/document.dto';
import { DocumentStatus, PermissionAction, UserRole } from '../enum';
import { imageFileFilter, uploadFileHandler } from '../utils/fileUpload.utils';
import { StaffDocumentsService } from './staff-documents.service';
import { DocumentStatusDto } from '../common/dto/document-status.dto';

@Controller('staff-documents')
export class StaffDocumentsController {
  constructor(private readonly staffDocumentsService: StaffDocumentsService) {}

  // staffId and same staff of AccountId
  @Post(':staffDetailId/:staffAccountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'staff_document'])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Param('staffDetailId') staffDetailId: string,
    @Param('staffAccountId') staffAccountId: string,
    @Body() dto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Account,
  ) {
    await this.staffDocumentsService.findOneByAccount(staffDetailId, dto.type);
    const fileName = 'staff/documents/' + Date.now() + '.webp';
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        'File not uploaded. Try after some time!',
      );
    }

    return this.staffDocumentsService.create(
      fileName,
      dto.type,
      staffDetailId,
      user.id,
      staffAccountId,
    );
  }

  @Patch('status/:id/:staffAccountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'staff_document'])
  status(
    @Param('id') id: string,
    @Param('staffAccountId') staffAccountId: string,
    @Body() dto: DocumentStatusDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.staffDocumentsService.status(id, dto, staffAccountId);
  }

  @Delete(':id/:staffAccountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, 'staff_document'])
  remove(
    @Param('id') id: string,
    @Param('staffAccountId') staffAccountId: string,
    @CurrentUser() user: Account,
  ) {
    return this.staffDocumentsService.status(
      id,
      {
        status: DocumentStatus.DELETED,
        updatedId: user.id,
      },
      staffAccountId,
    );
  }
}
