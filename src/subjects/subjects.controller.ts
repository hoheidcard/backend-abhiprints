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
import { PermissionAction, UserRole } from 'src/enum';
import { SubjectDto } from './dto/subject.dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'subject'])
  create(@Body() dto: SubjectDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.subjectsService.create(dto);
  }

  @Post(':settingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'subject'])
  createByAdmin(@Param('settingId') settingId: string, @Body() dto: SubjectDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = settingId;
    return this.subjectsService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'subject'])
  findAll(@Query() dto: CommonPaginationDto) {
    return this.subjectsService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'subject'])
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'subject'])
  update(
    @Param('id') id: string,
    @Body() dto: SubjectDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.subjectsService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'subject'])
  remove(@Param('id') id: string, @Body() status: DefaultStatusDto) {
    return this.subjectsService.status(id, status);
  }
}
