import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { PermissionAction, UserRole } from "src/enum";
import { UpdateSettingDto } from "./dto/create-setting.dto";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findOne(@CurrentUser() user: Account) {
    return this.settingsService.findOne(user.settingId);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findOneById(@Param("id") id: string) {
    return this.settingsService.findOne(id);
  }

  @Patch("my-settings")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "csv_setting"])
  updates(@CurrentUser() user: Account, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(user.settingId, dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "csv_setting"])
  update(@Param("id") id: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(id, dto);
  }
}
