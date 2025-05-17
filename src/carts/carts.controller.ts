import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { PermissionAction, UserRole } from "src/enum";
import { CartsService } from "./carts.service";
import {
  CancelOrderDto,
  PlaceOrderDto,
  StatusDto,
} from "./dto/cart-status.dto";
import { PaginationDto } from "./dto/pagination-cart.dto";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";

@Controller("carts")
export class CartsController {
  constructor(
    private readonly cartsService: CartsService
    // private readonly nodeMailerService: NodeMailerService,
  ) {}

  @Get("all")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findAllByUser(@Query() dto: PaginationDto, @CurrentUser() user: Account) {
    return this.cartsService.findByUser(
      user.id,
      user.settingId,
      user.roles,
      dto
    );
  }

  @Get("user")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findByUser(@Query() dto: CommonPaginationDto, @CurrentUser() user: Account) {
    return this.cartsService.findListByUser(
      user.id,
      dto
    );
  }

  // @Patch("school-upper/:id")
  // @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  // @Roles(...Object.values(UserRole))
  // @CheckPermissions([PermissionAction.UPDATE, "card_order"])
  // schoolUpper(@Param("id") id: string) {
  //   return this.cartsService.assignSchoolToUpper(id);
  // }

  // @Patch("sub-partner-upper/:id")
  // @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  // @Roles(...Object.values(UserRole))
  // @CheckPermissions([PermissionAction.UPDATE, "card_order"])
  // subPartnerUpper(@Param("id") id: string, @CurrentUser() user: Account) {
  //   return this.cartsService.assignSubPartnerToUpper(id, user.id);
  // }

  // @Patch("partner-upper/:id")
  // @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  // @Roles(...Object.values(UserRole))
  // @CheckPermissions([PermissionAction.UPDATE, "card_order"])
  // partnerUpper(@Param("id") id: string, @CurrentUser() user: Account) {
  //   return this.cartsService.assignPartnerToUpper(id, user.id);
  // }

  @Put("cancel-order/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  cancelOrder(@Param("id") id: string, @Body() dto: CancelOrderDto) {
    return this.cartsService.cancelOrder(id, dto);
  }

  @Put("place-order/:settingId/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  placeOrder(@Body() dto: PlaceOrderDto, @Param('settingId') settingId: string, @Param('accountId') accountId: string) {
    return this.cartsService.placeOrder(dto, settingId, accountId);
  }
 
  @Put("user/place-order")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  userPlaceOrder(@Body() dto: PlaceOrderDto, @CurrentUser() user: Account) {
    console.log(dto, user);
    
    // return
    return this.cartsService.placeUserOrder(dto, user.id);
  }

  @Put("status/:orderId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "cart"])
  statusByVendor(@Param("orderId") orderId: string, @Body() dto: StatusDto) {
    return this.cartsService.status(orderId, dto);
  }
}
