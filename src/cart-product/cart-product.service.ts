import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartStatus, ProductFileType } from "src/enum";
import { Repository } from "typeorm";
import { CartProductDto } from "./dto/cart-product.dto";
import { CartProductVariant } from "./entities/cart-product-variant.entity";
import { CartProduct } from "./entities/cart-product.entity";

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProduct)
    private readonly repo: Repository<CartProduct>,
    @InjectRepository(CartProductVariant)
    private readonly variantRepo: Repository<CartProductVariant>
  ) {}

  async create(dto: CartProductDto) {
    const count = await this.repo.count({
      where: {
        accountId: dto.accountId,
        status: CartStatus.CART,
      },
    });

    if (count > 25) {
      throw new NotFoundException("Only 25 items are allowed in cart!");
    }

    const result = await this.repo
      .createQueryBuilder("cartProduct")
      .where(
        "cartProduct.accountId = :accountId AND cartProduct.settingId = :settingId AND cartProduct.idCardsStockId = :productId AND cartProduct.status IN (:...status)",
        {
          accountId: dto.accountId,
          settingId: dto.settingId,
          productId: dto.idCardsStockId,
          status: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
        }
      )
      .getOne();

    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findList(cartId: string) {
    const [result, total] = await this.repo
      .createQueryBuilder("cartProduct")
      .leftJoinAndSelect("cartProduct.cart", "cart")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("cartProduct.cartProductVariant", "cartProductVariant")
      .leftJoinAndSelect("cartProductVariant.productVariant", "productVariant")
      .leftJoinAndSelect(
        "idCardsStock.productImage",
        "productImage",
        "productImage.type = :piType",
        { piType: ProductFileType.IMAGE }
      )
      .leftJoinAndSelect("idCardsStock.category", "category")
      .select([
        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",

        "cart.id",

        "paymentHistory.id",
        "paymentHistory.mode",
        "paymentHistory.createdAt",

        "account.id",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",
        "idCardsStock.title",
        "idCardsStock.code",

        "cartProductVariant.id",

        "productVariant.id",
        "productVariant.name",
        "productVariant.type",

        "productImage.id",
        "productImage.file",

        "category.id",
        "category.title",
      ])
      .where(
        "cart.cartId = :cartId AND cart.status IN (:...cstatus) AND cartProduct.status IN (:...cpstatus)",
        {
          accountId: cartId,
          cstatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
          cpstatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
        }
      )
      .orderBy({ "cartProduct.createdAt": "DESC" })
      .getManyAndCount();

    let amount = 0;
    let discount = 0;
    let partnerDiscount = 0;
    let additionalDiscount = 0;
    let totalAmount = 0;
    let shippingCost = 0;

    result.forEach((element) => {
      amount += element["idCardsStock"]["price"] * element.quantity;
      discount += element["idCardsStock"]["discountedPrice"] * element.quantity;
      totalAmount += element["idCardsStock"]["finalPrice"] * element.quantity;
      partnerDiscount = element["idCardsStock"]["partnerDiscount"];
      // additionalDiscount = element["idCardsStock"]["additionalDiscount"];
    });
    additionalDiscount = (result[0].cart["addDiscount"] / amount) * 100;

    return {
      result,
      total,
      amount,
      discount,
      totalAmount,
      partnerDiscount,
      additionalDiscount,
      shippingCost,
    };
  }

  async cartListBySetting(settingId: string) {
    const [result, total] = await this.repo
      .createQueryBuilder("cartProduct")
      .leftJoinAndSelect("cartProduct.cart", "cart")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("cartProduct.cartProductVariant", "cartProductVariant")
      .leftJoinAndSelect("cartProductVariant.productVariant", "productVariant")
      .leftJoinAndSelect(
        "idCardsStock.productImage",
        "productImage",
        "productImage.type = :piType",
        { piType: ProductFileType.IMAGE }
      )
      .leftJoinAndSelect("idCardsStock.category", "category")
      .select([
        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",

        "cart.id",
        "cart.orderId",
        "cart.status",
        "cart.orderDate",
        "cart.invoiceNumber",
        "cart.total",
        "cart.roles",
        "cart.createdAt",
        "cart.cgst",
        "cart.sgst",
        "cart.igst",
        "cart.addDiscount",
        "cart.shipping",

        "paymentHistory.id",
        "paymentHistory.mode",
        "paymentHistory.createdAt",

        "account.id",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",
        "idCardsStock.title",
        "idCardsStock.code",

        "cartProductVariant.id",

        "productVariant.id",
        "productVariant.name",
        "productVariant.type",

        "productImage.id",
        "productImage.file",

        "category.id",
        "category.title",
      ])
      .where(
        "cart.settingId = :settingId AND cart.status IN (:...cstatus) AND cartProduct.status IN (:...cpstatus)",
        {
          settingId: settingId,
          cstatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
          cpstatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
        }
      )
      .getManyAndCount();

    let amount = 0;
    let discount = 0;
    let partnerDiscount = 0;
    let additionalDiscount = 0;
    let totalAmount = 0;
    let shippingCost = 0;
    result.forEach((element) => {
      amount += element["idCardsStock"]["price"] * element.quantity;
      discount += element["idCardsStock"]["discountedPrice"] * element.quantity;
      totalAmount += element["idCardsStock"]["finalPrice"] * element.quantity;
      partnerDiscount = element["idCardsStock"]["partnerDiscount"];
      // additionalDiscount = element["idCardsStock"]["additionalDiscount"];
    });
    additionalDiscount = (result[0].cart["addDiscount"] / amount) * 100;

    return {
      result,
      total,
      amount,
      discount,
      totalAmount,
      partnerDiscount,
      additionalDiscount,
      shippingCost,
    };
  }

  async cartListByAccount(accountId: string) {
    console.log(accountId);
    
    const [result, total] = await this.repo
      .createQueryBuilder("cartProduct")
      .leftJoinAndSelect("cartProduct.cart", "cart")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("cartProduct.cartProductVariant", "cartProductVariant")
      .leftJoinAndSelect("cartProductVariant.productVariant", "productVariant")
      .leftJoinAndSelect(
        "idCardsStock.productImage",
        "productImage",
        "productImage.type = :piType",
        { piType: ProductFileType.IMAGE }
      )
      .leftJoinAndSelect("idCardsStock.category", "category")
      .select([
        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",

        "cart.id",

        "paymentHistory.id",
        "paymentHistory.mode",
        "paymentHistory.createdAt",

        "cart.id",
        "cart.orderId",
        "cart.status",
        "cart.orderDate",
        "cart.invoiceNumber",
        "cart.total",
        "cart.roles",
        "cart.createdAt",
        "cart.cgst",
        "cart.sgst",
        "cart.igst",
        "cart.shipping",
        "cart.addDiscount",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",
        "idCardsStock.title",
        "idCardsStock.code",

        "cartProductVariant.id",

        "productVariant.id",
        "productVariant.name",
        "productVariant.type",

        "productImage.id",
        "productImage.file",

        "category.id",
        "category.title",
      ])
      .where(
        "cart.accountId = :accountId AND cart.status IN (:...cstatus) AND cartProduct.status IN (:...cpstatus)",
        {
          accountId: accountId,
          cstatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
          cpstatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
        }
      )
      .orderBy({ "cartProduct.createdAt": "DESC" })
      .getManyAndCount();

    let amount = 0;
    let discount = 0;
    let partnerDiscount = 0;
    let additionalDiscount = 0;
    let totalAmount = 0;
    let shippingCost = 0;

    result.forEach((element) => {
      amount += element["idCardsStock"]["price"] * element.quantity;
      discount += element["idCardsStock"]["discountedPrice"] * element.quantity;
      totalAmount += element["idCardsStock"]["finalPrice"] * element.quantity;
      partnerDiscount = element["idCardsStock"]["partnerDiscount"];
      // additionalDiscount = element["idCardsStock"]["additionalDiscount"];
    });
    additionalDiscount = (result[0].cart["addDiscount"] / amount) * 100;

    return {
      result,
      total,
      amount,
      discount,
      totalAmount,
      partnerDiscount,
      additionalDiscount,
      shippingCost,
    };
  }

  async invoice(cartId: string) {
    const [result, total] = await this.repo
      .createQueryBuilder("cartProduct")
      .leftJoinAndSelect("cartProduct.cart", "cart")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("account.userDetail", "userDetail")
      .leftJoinAndSelect("cart.userAddress", "userAddress")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("cartProduct.cartProductVariant", "cartProductVariant")
      .leftJoinAndSelect("cartProductVariant.productVariant", "productVariant")
      .leftJoinAndSelect(
        "idCardsStock.productImage",
        "productImage",
        "productImage.type = :piType",
        { piType: ProductFileType.IMAGE }
      )
      .leftJoinAndSelect("idCardsStock.category", "category")
      .select([
        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",

        "cart.id",
        "cart.orderId",
        "cart.status",
        "cart.orderDate",
        "cart.invoiceNumber",
        "cart.total",
        "cart.roles",
        "cart.createdAt",
        "cart.cgst",
        "cart.sgst",
        "cart.igst",
        "cart.shipping",
        "cart.addDiscount",

        "userAddress.name",
        "userAddress.altPhone",
        "userAddress.phone",
        "userAddress.city",
        "userAddress.state",
        "userAddress.address",

        "paymentHistory.id",
        "paymentHistory.mode",
        "paymentHistory.createdAt",

        "account.id",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",
        "idCardsStock.title",
        "idCardsStock.code",

        "cartProductVariant.id",

        "productVariant.id",
        "productVariant.name",
        "productVariant.type",

        "productImage.id",
        "productImage.file",

        "category.id",
        "category.title",
      ])
      .where("cartProduct.cartId = :cartId", {
        cartId: cartId,
      })
      .orderBy({ "cartProduct.createdAt": "DESC" })
      .getManyAndCount();

    let amount = 0;
    let discount = 0;
    let partnerDiscount = 0;
    let additionalDiscount = 0;
    let totalAmount = 0;
    let shippingCost = 0;

    result.forEach((element) => {
      amount += element["idCardsStock"]["price"] * element.quantity;
      discount += element["idCardsStock"]["discountedPrice"] * element.quantity;
      totalAmount += element["idCardsStock"]["finalPrice"] * element.quantity;
      partnerDiscount = element["idCardsStock"]["partnerDiscount"];
      // additionalDiscount = element["idCardsStock"]["additionalDiscount"];
    });
    additionalDiscount = (result[0].cart["addDiscount"] / amount) * 100;

    return {
      result,
      total,
      amount,
      discount,
      totalAmount,
      partnerDiscount,
      additionalDiscount,
      shippingCost: result[0].cart["shipping"],
      user: result[0].cart["userAddress"],
      cart: result[0].cart,
    };
  }

  async increase(id: string) {
    return this.repo
      .createQueryBuilder()
      .update()
      .set({
        quantity: () => "quantity + " + 1,
      })
      .where("id = :id AND status IN (:...status)", {
        id,
        status: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
      })
      .execute();
  }

  async decrease(id: string) {
    return this.repo
      .createQueryBuilder()
      .update()
      .set({
        quantity: () =>
          `CASE WHEN quantity > 0 THEN quantity - 1 ELSE quantity END`,
      })
      .where("id = :id AND status IN (:...status)", {
        id,
        status: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
      })
      .execute();
  }

  async createVariant(cartProductId: string, productVariantId: string) {
    const result = await this.variantRepo.findOne({
      where: { cartProductId, productVariantId },
    });
    if (!result) {
      this.variantRepo.save({ cartProductId, productVariantId });
    }
  }

  async remove(id: string) {
    const result = await this.repo.findOne({
      where: { id: id },
    });
    if (!result) {
      throw new NotFoundException("Product in cart not found!");
    }
    return this.repo.remove(result);
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({
      where: { id: id },
    });
    if (!result) {
      throw new NotFoundException("Product order not found!");
    }
    return result;
  }
}
