import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionAction, UserRole } from '../enum';
import { PaginationDto } from './dto/pagination.dto';
import { LoginHistoryService } from './login-history.service';

@Controller('login-history')
export class LoginHistoryController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Get(':id')
  @Roles(...(Object.values(UserRole) as string[]))
  findAllByUser(@Query() query: PaginationDto, @Param('id') id: string) {
    return this.loginHistoryService.findAll(query.limit, query.offset, id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'login_history'])
  findAll(@Query() query: PaginationDto, @CurrentUser() user: Account) {
    return this.loginHistoryService.findAll(query.limit, query.offset, user.id);
  }
}
