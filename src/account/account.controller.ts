import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { DefaultStatusPaginationDto } from "src/common/dto/pagination-with-default-status.dto";
import { DefaultStatus, PermissionAction, UserRole } from "src/enum";
import { MenusService } from "src/menus/menus.service";
import { PermissionsService } from "src/permissions/permissions.service";
import { UserPermissionsService } from "src/user-permissions/user-permissions.service";
import { AccountService } from "./account.service";
import {
  CreateAccountDto,
  PasswordDto,
  PasswordWithOldDto,
} from "./dto/account.dto";
import { Account } from "./entities/account.entity";

@Controller("account")
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly menuService: MenusService,
    private readonly permissionService: PermissionsService,
    private readonly userPermService: UserPermissionsService
  ) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "account"])
  async create(@Body() dto: CreateAccountDto, @CurrentUser() user: Account) {
    dto.roles = UserRole.ADMIN;
    const account = await this.accountService.create(dto, user.id);
    const menus = await this.menuService.findAll();
    const perms = await this.permissionService.findAll();

    const obj = [];
    menus.forEach((menu) => {
      perms.forEach((perm) => {
        obj.push({
          accountId: account.id,
          menuId: menu.id,
          permissionId: perm.id,
        });
      });
    });
    this.userPermService.create(obj);
    return account;
  }

  @Get("my-admin")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "account"])
  find(
    @Query() query: DefaultStatusPaginationDto,
    @CurrentUser() user: Account
  ) {
    return this.accountService.find(query, user.id);
  }

  @Get('perms/:accountId')
  async createPerms(@Param('accountId') accountId: string) {
    const menus = await this.menuService.findAll();
    const perms = await this.permissionService.findAll();

    const obj = [];
    menus.forEach((menu) => {
      perms.forEach((perm) => {
        obj.push({
          accountId: accountId,
          menuId: menu.id,
          permissionId: perm.id,
          status: true
        });
      });
    });
    this.userPermService.create(obj);
    return 'Done';
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "account"])
  profile(@CurrentUser() user: Account) {
    return this.accountService.findOne(user.id);
  }

  @Get("user/profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRole.USER)
  userProfile(@CurrentUser() user: Account) {   
    return this.accountService.findProfile(user.id);
  }
  
  @Get("my-admin/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "account"])
  findById(
    @Query() query: DefaultStatusPaginationDto,
    @Param("id") id: string
  ) {
    return this.accountService.find(query, id);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "account"])
  findOne(@Param("id") id: string) {
    return this.accountService.findOne(id);
  }

  @Patch("password")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  updateOwnPassword(
    @Body() dto: PasswordWithOldDto,
    @CurrentUser() user: Account
  ) {
    return this.accountService.updateOwnPassword(dto, user.id);
  }

  @Patch("reset/:id")
  resetPassword(@Body() dto: PasswordDto, @Param("id") id: string) {
    return this.accountService.updatePassword(dto, id);
  }

  @Patch("password/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  updatePassword(@Body() dto: PasswordDto, @Param("id") id: string) {
    return this.accountService.updatePassword(dto, id);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "account"])
  status(@Param("id") id: string, @Body() dto: DefaultStatus) {
    return this.accountService.status(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.DELETE, "account"])
  remove(@Param("id") id: string) {
    return this.accountService.remove(id);
  }
}
