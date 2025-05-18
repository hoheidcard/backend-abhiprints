import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionAction, UserRole } from '../enum';
import { CreateStaffSubjectDto } from './dto/create-staff-subject.dto';
import { StaffSubjectService } from './staff-subject.service';

@Controller('staff-subject')
export class StaffSubjectController {
  constructor(private readonly staffSubjectService: StaffSubjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'staff_subject'])
  async create(
    @Body() dto: CreateStaffSubjectDto,
    @CurrentUser() user: Account,
  ) {
    dto.accountId = user.id;
    return this.staffSubjectService.create(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, 'staff_subject'])
  remove(@Param('id') id: string) {
    return this.staffSubjectService.remove(id);
  }
}
