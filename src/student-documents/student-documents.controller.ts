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
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DocumentStatusDto } from 'src/common/dto/document-status.dto';
import { DocumentDto } from 'src/common/dto/document.dto';
import { DocumentStatus, PermissionAction, UserRole } from 'src/enum';
import { imageFileFilter, uploadFileHandler } from 'src/utils/fileUpload.utils';
import { StudentDocumentsService } from './student-documents.service';

@Controller('student-documents')
export class StudentDocumentsController {
  constructor(
    private readonly studentDocumentsService: StudentDocumentsService,
  ) {}

  // staffId and same staff of AccountId
  @Post(':studentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'student_document'])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Param('studentId') studentId: string,
    @Body() dto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Account,
  ) {
    await this.studentDocumentsService.findOneByAccount(studentId, dto.type);
    const fileName = 'students/documents/' + Date.now() + '.webp';
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        'File not uploaded. Try after some time!',
      );
    }

    return this.studentDocumentsService.create(
      fileName,
      dto.type,
      studentId,
      user.id,
    );
  }

  @Patch('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'student_document'])
  status(
    @Param('id') id: string,
    @Body() dto: DocumentStatusDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.studentDocumentsService.status(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.DELETE, 'student_document'])
  remove(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.studentDocumentsService.status(id, {
      status: DocumentStatus.DELETED,
      updatedId: user.id,
    });
  }
}
