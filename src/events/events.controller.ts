import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "../account/entities/account.entity";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CheckPermissions } from "../auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { DatePaginationDto } from "../common/dto/pagination-with-date.dto";
import { EventFor, EventLowerFor, PermissionAction, UserRole } from "../enum";
import { EventDto, PaginationDto } from "./dto/event.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, "event"])
  async create(@Body() dto: EventDto, @CurrentUser() user: Account) {
    console.log(dto);
    if (!dto.type) {
      dto.type = EventLowerFor.UPPER;
    }
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    const events = dto.eventIds;

    const payload = await this.eventsService.create(dto);
    if (dto.all) {
      if (
        dto.eventFor === EventFor.PARTNER ||
        dto.eventFor === EventFor.SUB_PARTNER
      ) {
        this.eventsService.createMultiEventP(dto.eventFor, payload.id);
      } else {
        this.eventsService.createMultiEventO(dto.eventFor, payload.id);
      }
    } else if (events.length > 0) {

      if (
        dto.eventFor === EventFor.PARTNER ||
        dto.eventFor === EventFor.SUB_PARTNER
      ) {
        this.eventsService.createSpecificEventP(events, payload.id);
      } else {
        this.eventsService.createSpecificEventO(events, payload.id);
      }
    }
    return payload;
  }

  @Get("for-agents/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "event"])
  findAllForAgents(
    @Query() dto: DatePaginationDto,
    @Param("id") id: string,
    @CurrentUser() user: Account
  ) {
    let type = null;
    if (user.roles === UserRole.STAFF) {
      type = EventLowerFor.STAFF;
    } else if (user.roles === UserRole.STUDENT) {
      type = EventLowerFor.STUDENT;
    } else {
      type = EventLowerFor.UPPER;
    }
    return this.eventsService.findAllForAgents(dto, id, type);
  }

  @Get("for-organization/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  // @CheckPermissions([PermissionAction.READ, "event"])
  findAllForOrganization(
    @Query() dto: DatePaginationDto,
    @Param("id") id: string,
    @CurrentUser() user: Account
  ) {
    let type = null;
    if (user.roles === UserRole.STAFF) {
      type = EventLowerFor.STAFF;
    } else if (user.roles === UserRole.STUDENT) {
      type = EventLowerFor.STUDENT;
    } else {
      type = EventLowerFor.UPPER;
    }
    return this.eventsService.findAllForOrg(dto, id, type);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "event"])
  findAll(@Query() dto: PaginationDto, @CurrentUser() user: Account) {
    return this.eventsService.findAll(dto, user.id);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findOne(@Param("id") id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "event"])
  update(
    @Param("id") id: string,
    @Body() dto: EventDto,
    @CurrentUser() user: Account
  ) {
    dto.updatedId = user.id;
    return this.eventsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, "event"])
  remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }
}
