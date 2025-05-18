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
import { DepartmentsService } from './departments.service';
import { DepartmentDto } from './dto/department.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Account } from '../account/entities/account.entity';
import { DefaultStatusPaginationDto } from '../common/dto/pagination-with-default-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole, PermissionAction } from '../enum';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { UpdateDepartmentDto } from './dto/update-depertmant.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @Post(':settingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.CREATE, 'department'])
  create( @Param('settingId') settingId:string,@Body() dto: DepartmentDto, @CurrentUser() user: Account) {
    dto.accountId = user.id
    dto.settingId = settingId
    dto.updatedId = user.id
    return this.departmentsService.create(dto);
  }

  //for admin root
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.READ, 'department'])
  findAll(@Query()query:DefaultStatusPaginationDto,@CurrentUser() user: Account ) {
    return this.departmentsService.findAll( user.id,query);
  }


  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.READ, 'department'])
  findOne(@Param('id') id: string) {
    return this.departmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.UPDATE, 'department'])
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentsService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.UPDATE, 'department'])
  status(@Param('id') id: string ,statusDto:DefaultStatusDto) {
    return this.departmentsService.status(id,statusDto);
  }
 
}
