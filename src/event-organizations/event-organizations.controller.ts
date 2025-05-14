import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionAction, UserRole } from 'src/enum';
import { PaginationDto } from 'src/events/dto/event.dto';
import { EventOrganizationsService } from './event-organizations.service';

@Controller('event-organizations')
export class EventOrganizationsController {
  constructor(
    private readonly eventOrganizationsService: EventOrganizationsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'event'])
  findAll(@Query() dto: PaginationDto) {
    return this.eventOrganizationsService.findAll(dto);
  }
}
