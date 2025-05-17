import {
  Body,
  Controller,
  Delete,
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
import { PermissionAction, UserRole } from 'src/enum';
import { ClassDivService } from './class-div.service';
import { ClassDivDto } from './dto/class-div.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';

@Controller('class-div')
export class ClassDivController {
  constructor(private readonly classDivService: ClassDivService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'class_div'])
  create(@Body() dto: ClassDivDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.classDivService.create(dto);
  }

  @Post(':settingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'class_div'])
  createByAdmin(@Param('settingId') settingId: string, @Body() dto: ClassDivDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = settingId;
    return this.classDivService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'class_div'])
  findAll(@Query() query: CommonPaginationDto) {
    return this.classDivService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'class_div'])
  findOne(@Param('id') id: string) {
    return this.classDivService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'class_div'])
  update(
    @Param('id') id: string,
    @Body() dto: ClassDivDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;

    return this.classDivService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'class_div'])
  remove(@Param('id') id: string,@Body() dto:DefaultStatusDto) {
    return this.classDivService.status(id,dto);
  }
}
