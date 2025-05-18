import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionAction, UserRole } from '../enum';
import { DefaultSettingPermissionService } from './default-setting-permission.service';
import { UpdatePermissionDto } from './dto/create-default-setting-permission.dto';

@Controller('default-setting-permission')
export class DefaultSettingPermissionController {
  constructor(
    private readonly defaultSettingPermissionService: DefaultSettingPermissionService,
  ) {}

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
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
