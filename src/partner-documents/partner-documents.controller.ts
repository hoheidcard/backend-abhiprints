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
import { Express } from 'express'; // 
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DocumentStatusDto } from '../common/dto/document-status.dto';
import { DocumentDto } from '../common/dto/document.dto';
import { DocumentStatus, PermissionAction, UserRole } from '../enum';
import { imageFileFilter, uploadFileHandler } from '../utils/fileUpload.utils';
import { PartnerDocumentsService } from './partner-documents.service';

@Controller('partner-documents')
export class PartnerDocumentsController {
  constructor(
    private readonly partnerDocumentsService: PartnerDocumentsService,
  ) {}

  // partnerId and same partner of AccountId
  @Post(':partnerDetailId/:partnerAccountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'partner_document'])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Param('partnerDetailId') partnerDetailId: string,
    @Param('partnerAccountId') partnerAccountId: string,
    @Body() dto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Account,
  ) {
    await this.partnerDocumentsService.findOneByAccount(
      partnerDetailId,
      dto.type,
    );
    const fileName = 'partner/documents/' + Date.now() + '.webp';
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        'File not uploaded. Try after some time!',
      );
    }

    return this.partnerDocumentsService.create(
      fileName,
      dto.type,
      partnerDetailId,
      user.id,
    );
  }

  @Patch('status/:id/:partnerAccountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'partner_document'])
  status(
    @Param('id') id: string,
    @Param('partnerAccountId') partnerAccountId: string,
    @Body() dto: DocumentStatusDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.partnerDocumentsService.status(id, dto, partnerAccountId);
  }

  @Delete(':id/:partnerAccountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.DELETE, 'partner_document'])
  remove(
    @Param('id') id: string,
    @Param('partnerAccountId') partnerAccountId: string,
    @CurrentUser() user: Account,
  ) {
    return this.partnerDocumentsService.status(
      id,
      {
        status: DocumentStatus.DELETED,
        updatedId: user.id,
      },
      partnerAccountId,
    );
  }
}
