import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionAction, UserRole } from 'src/enum';
import { DefaultSettingPermissionService } from './default-setting-permission.service';
import { UpdatePermissionDto } from './dto/create-default-setting-permission.dto';

@Controller('default-setting-permission')
export class DefaultSettingPermissionController {
  constructor(
    private readonly defaultSettingPermissionService: DefaultSettingPermissionService,
  ) {}

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'default_setting_permission'])
  async update(@Body() dto: UpdatePermissionDto) {
    const obj = [];
    dto.menu.forEach((menuItem) => {
      menuItem.userPermission.forEach((permItem) => {
        obj.push({
          id: permItem.id,
          defaultSettingId: permItem.defaultSettingId,
          menuId: menuItem.id,
          permissionId: permItem.permission.id,
          status: permItem.status,
        });
      });
    });
    this.defaultSettingPermissionService.update(obj);
    return { menu: dto.menu };
  }
}
