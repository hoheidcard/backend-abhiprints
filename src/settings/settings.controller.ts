import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "../account/entities/account.entity";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CheckPermissions } from "../auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PermissionAction, UserRole } from "../enum";
import { UpdateSettingDto } from "./dto/create-setting.dto";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findOne(@CurrentUser() user: Account) {
    return this.settingsService.findOne(user.settingId);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findOneById(@Param("id") id: string) {
    return this.settingsService.findOne(id);
  }

  @Patch("my-settings")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "csv_setting"])
  updates(@CurrentUser() user: Account, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(user.settingId, dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "csv_setting"])
  update(@Param("id") id: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(id, dto);
  }
}
