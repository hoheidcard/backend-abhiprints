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
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { PermissionAction, UserRole } from "src/enum";
import { ClassListService } from "./class-list.service";
import {
  ClassListDivDto,
  ClassListDto,
  PProductDto,
  ProductDto,
} from "./dto/class-list.dto";
import { EditorDesignDto } from "src/id-cards-stock/dto/card-design.dto";

@Controller("class-list")
export class ClassListController {
  constructor(private readonly classListService: ClassListService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "class_list"])
  create(@Body() dto: ClassListDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.classListService.create(dto);
  }

  @Post(":settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "class_list"])
  createByAdmin(
    @Param("settingId") id: string,
    @Body() dto: ClassListDto,
    @CurrentUser() user: Account
  ) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = id;
    return this.classListService.create(dto);
  }

  @Get(":settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findAllBySchool(@Param("settingId") settingId: string) {
    return this.classListService.findAllBySchool(settingId);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "class_list"])
  findAll(@Query() query: CommonPaginationDto) {
    return this.classListService.findAll(query);
  }

  @Patch("setting")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "class_list"])
  updateSetting(@Body() dto: ClassListDivDto) {
    return this.classListService.updateSetting(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "class_list"])
  update(
    @Param("id") id: string,
    @Body() dto: ClassListDto,
    @CurrentUser() user: Account
  ) {
    dto.updatedId = user.id;
    return this.classListService.update(id, dto);
  }

  @Put("products-parent")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "class_list"])
  pproduct(@Body() dto: PProductDto[]) {
    return this.classListService.pproducts(dto);
  }

  @Put("products")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "class_list"])
  sproduct(@Body() dto: ProductDto[]) {
    return this.classListService.products(dto);
  }

  @Put("peditor/:id/::settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  updatePCard(@Param("id") id: string, @Param("settingId") settingId: string, @Body() dto: EditorDesignDto) {
    return this.classListService.updatePEditor(id,settingId, dto);
  }

  @Put("seditor/:id/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  updateSCard(@Param("id") id: string, @Param("settingId") settingId: string, @Body() dto: EditorDesignDto) {
    return this.classListService.updateSEditor(id, settingId, dto);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "class_list"])
  status(@Param("id") id: string, @Body() dto: DefaultStatusDto) {
    return this.classListService.status(id, dto);
  }

  @Delete("setting/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "class_list"])
  delete(@Param("id") id: string) {
    return this.classListService.remove(id);
  }
}
