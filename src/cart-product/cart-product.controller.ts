import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CartsService } from "src/carts/carts.service";
import { UserRole } from "src/enum";
// import { createEWayBill } from "src/utils/pdf-e-way-bill.utils";
// import { createInvoice } from "src/utils/pdf-invoice.utils";
import { Response } from "express";
import { createInvoice } from "src/utils/invoice.utils";
import { CartProductService } from "./cart-product.service";
import { CartProductDto } from "./dto/cart-product.dto";

@Controller("cart-product")
export class CartProductController {
  constructor(
    private readonly cartProductService: CartProductService,
    private readonly cartService: CartsService
  ) {}

  @Post("/:settingId/:roles")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  async createByOther(
    @Body() dto: CartProductDto,
    @Param("settingId") settingId: string,
    @Param("roles") roles: UserRole
  ) {
    const user = await this.cartService.getAccount(settingId, roles);
    dto.accountId = user.id;
    dto.settingId = user.settingId;
    const cart = await this.cartService.findActiveCart(user.id, user.settingId);
    if (cart) {
      dto.cartId = cart.id;
    } else {
      const payload = await this.cartService.create(
        user.id,
        user.createdBy,
        roles,
        user.settingId
      );
      dto.cartId = payload.id;
    }
    const cartProduct = await this.cartProductService.create(dto);
    if (dto.productVariant && dto.productVariant.length > 0) {
      dto.productVariant.forEach((element) => {
        this.cartProductService.createVariant(
          cartProduct.id,
          element.productVariantId
        );
      });
    }
    return cartProduct;
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRole.USER)
  async create(@Body() dto: CartProductDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.settingId = user.settingId;
    const cart = await this.cartService.findActiveCart(user.id, user.settingId);
    if (cart) {
      dto.cartId = cart.id;
    } else {
      const payload = await this.cartService.create(
        user.id,
        user.createdBy,
        user.roles,
        user.settingId
      );
      dto.cartId = payload.id;
    }
    const cartProduct = await this.cartProductService.create(dto);
    if (dto.productVariant && dto.productVariant.length > 0) {
      dto.productVariant.forEach((element) => {
        this.cartProductService.createVariant(
          cartProduct.id,
          element.productVariantId
        );
      });
    }
    return cartProduct;
  }

  @Post("user-add")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRole.USER)
  async userCreate(@Body() dto: CartProductDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.settingId = user.settingId;
    const cart = await this.cartService.findUserActiveCart(user.id);
    if (cart) {
      dto.cartId = cart.id;
    } else {
      const payload = await this.cartService.create(
        user.id,
        user.createdBy,
        user.roles,
        user.settingId
      );
      dto.cartId = payload.id;
    }
    const cartProduct = await this.cartProductService.create(dto);
    if (dto.productVariant && dto.productVariant.length > 0) {
      dto.productVariant.forEach((element) => {
        this.cartProductService.createVariant(
          cartProduct.id,
          element.productVariantId
        );
      });
    }
    return cartProduct;
  }


  @Get("list/:cartId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  list(@Param("cartId") cartId: string) {
    return this.cartProductService.findList(cartId);
  }

  @Get("list/account")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  cartListByAccount(@CurrentUser() user: Account) {    
    return this.cartProductService.cartListByAccount(user.id);
  }

  @Get("userlist/account")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  cartListByUser(@CurrentUser() user: Account) {    
    return this.cartProductService.cartListByAccount(user.id);
  }

  @Get("list/org/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  listBySetting(@Param("settingId") settingId: string) {
    return this.cartProductService.cartListBySetting(settingId);
  }

  @Get("decrease/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  decrease(@Param("id") id: string) {
    return this.cartProductService.decrease(id);
  }

  @Get("increase/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  increase(@Param("id") id: string) {
    return this.cartProductService.increase(id);
  }

  @Get("invoice/:cartId")
  async generateEWayBill(
    @Res() res: Response,
    @Param("cartId") cartId: string
  ) {
    const data = await this.cartProductService.invoice(cartId);
    console.log(data);
    const invoice = {
      shipping: {
        name: data.user.name,
        address: data.user.address,
        city: data.user.city,
        state: data.user.state,
        country: "India",
        postal_code: data.user.pincode,
      },
      sellerDetails: {
        gstNo: "",
        placeOfSupply:
          "First Floor, Right Block F-49, Kartarpura Industrial Area, bais Godam, Jaipur 302006",
        shipmentId: data.cart["orderId"],
        orderNo: data.cart["orderId"],
        invoiceNo: data.cart["invoiceNumber"],
        invoiceDate: data.cart["orderDate"],
        orderDate: data.cart["orderDate"],
      },
      items: data.result,
      subtotal: data.amount,
      partnerDiscount: data.partnerDiscount,
      addDiscount: data.additionalDiscount,
      discount: data.discount,
      cgst: data.cart["cgst"],
      sgst: data.cart["sgst"],
      igst: data.cart["igst"],
      shippingCharge: data.shippingCost,
      total: data.totalAmount + data.shippingCost - data.partnerDiscount - data.additionalDiscount,
    };

    const pdf = await createInvoice(invoice);
    const name = Date.now().toString() + "-invoice.pdf";
    res.setHeader("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="${name}"`);
    pdf.pipe(res);
    pdf.end();
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  remove(@Param("id") id: string) {
    return this.cartProductService.remove(id);
  }
}
