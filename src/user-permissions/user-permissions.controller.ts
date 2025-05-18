import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionAction, UserRole } from '../enum';
import { UpdatePermissionDto } from './dto/permission.dto';
import { UserPermissionsService } from './user-permissions.service';

@Controller('user-permissions')
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'user_permission'])
  async update( @Body() dto: UpdatePermissionDto) {
    const obj = [];
    dto.menu.forEach((menuItem) => {
      menuItem.userPermission.forEach((permItem) => {
        obj.push({
          id: permItem.id,
          accountId: permItem.accountId,
          menuId: menuItem.id,
          permissionId: permItem.permission.id,
          status: permItem.status,
        });
      });
    });
    this.userPermissionsService.update(obj);
    return { menu: dto.menu };
  }
}
