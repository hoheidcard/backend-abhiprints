import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionAction, UserRole } from '../enum';
import { PaginationDto } from '../events/dto/event.dto';
import { EventOrganizationsService } from './event-organizations.service';

@Controller('event-organizations')
export class EventOrganizationsController {
  constructor(
    private readonly eventOrganizationsService: EventOrganizationsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'event'])
  findAll(@Query() dto: PaginationDto) {
    return this.eventOrganizationsService.findAll(dto);
  }
}
