import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionAction, UserRole } from 'src/enum';
import { StaffDepartmentDto } from './dto/staff-department.dto';
import { StaffDepartmentService } from './staff-department.service';

@Controller('staff-department')
export class StaffDepartmentController {
  constructor(
    private readonly staffDepartmentService: StaffDepartmentService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'staff_department'])
  create(@Body() dto: StaffDepartmentDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.staffDepartmentService.create(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.DELETE, 'staff_department'])
  remove(@Param('id') id: string) {
    return this.staffDepartmentService.remove(id);
  }
}
