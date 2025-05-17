import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/pagination-with-default-status.dto';
import { PermissionAction, UserRole } from 'src/enum';
import { NoticeDto } from './dto/notice.dto';
import { NoticesService } from './notices.service';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  // for organization only and CurrentUser
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'notice'])
  create(@Body() dto: NoticeDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.noticesService.create(dto);
  }

  @Get('all/:organizationDetailId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'notice'])
  findAll(
    @Param('organizationDetailId') organizationDetailId: string,
    @Query() query: DefaultStatusPaginationDto,
  ) {
    return this.noticesService.findAll(organizationDetailId, query);
  }

  // for students
  @Get('students?:organizationDetailId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'notice'])
  findAllForStudents(
    @Param('organizationDetailId') organizationDetailId: string,
    @Query() query: CommonPaginationDto,
  ) {
    return this.noticesService.findAllFroStudent(organizationDetailId, query);
  }

  // for organization only and CurrentUser
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'notice'])
  update(
    @Param('id') id: string,
    @Body() dto: NoticeDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.noticesService.update(id, dto);
  }

  // for organization only and CurrentUser
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'notice'])
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.noticesService.status(id, dto);
  }
}
