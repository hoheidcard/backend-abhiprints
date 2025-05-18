import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionAction, UserRole } from '../enum';
import { DesignationPermissionService } from './designation-permission.service';
import { UpdatePermissionDto } from './dto/designation-permission.dto';

@Controller('designation-permission')
export class DesignationPermissionController {
  constructor(
    private readonly designationPermissionService: DesignationPermissionService,
  ) {}

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'designation_permission'])
  async update(@Body() dto: UpdatePermissionDto) {
    const obj = [];
    dto.menu.forEach((menuItem) => {
      menuItem.userPermission.forEach((permItem) => {
        obj.push({
          id: permItem.id,
          designationId: permItem.designationId,
          menuId: menuItem.id,
          permissionId: permItem.permission.id,
          status: permItem.status,
        });
      });
    });
    this.designationPermissionService.update(obj);
    return { menu: dto.menu };
  }
}
