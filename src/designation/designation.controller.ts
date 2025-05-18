import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { ProductDto } from "../class-list/dto/class-list.dto";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { PermissionAction, UserRole } from "../enum";
import { DesignationService } from "./designation.service";
import { DesignationDto } from "./dto/designation.dto";
import { EditorDesignDto } from "../id-cards-stock/dto/card-design.dto";

@Controller("designation")
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post(":settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.CREATE, "designation"])
  createByAdmin(
    @Param("settingId") settingId: string,
    @Body() dto: DesignationDto,
    @CurrentUser() user: Account
  ) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = settingId;
    return this.designationService.create(dto);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.CREATE, "designation"])
  create(@Body() dto: DesignationDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.designationService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "designation"])
  findList(@Query() dto: CommonPaginationDto) {
    return this.designationService.findList(dto);
  }

  //for ALL
  @Get("all")
  findAll() {
    return this.designationService.findAll();
  }

  @Get("my-designation/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findMyDesignationBySettingId(@Param("settingId") settingId: string) {
    return this.designationService.findMyDesignation(settingId);
  }

  @Get("my-designation")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findMyDesignation(@CurrentUser() user: Account) {
    return this.designationService.findMyDesignation(user.settingId);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.READ, "designation"])
  findOne(@Param("id") id: string) {
    return this.designationService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.UPDATE, "designation"])
  async update(
    @Param("id") id: string,
    @Body() dto: DesignationDto,
    @CurrentUser() user: Account
  ) {
    dto.updatedId = user.id;
    return this.designationService.update(id, dto);
  }

  @Put("editor/:id/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  updateCard(@Param("id") id: string, @Param("settingId") settingId: string, @Body() dto: EditorDesignDto) {
    return this.designationService.updateEditor(id,settingId, dto);
  }

  @Put("products")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "designation"])
  product(@Body() dto: ProductDto[]) {
    return this.designationService.products(dto);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.ROOT)
  @CheckPermissions([PermissionAction.UPDATE, "designation"])
  status(@Param("id") id: string, @Body() dto: DefaultStatusDto) {
    return this.designationService.status(id, dto);
  }
}
