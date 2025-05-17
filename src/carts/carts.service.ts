import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/account/entities/account.entity";
import { CartProduct } from "src/cart-product/entities/cart-product.entity";
import { NotifyService } from "./../notify/notify.service";
// import { DeliveryPartnersService } from 'src/delivery-partners/delivery-partners.service';
import {
  CartStatus,
  DefaultStatus,
  PaymentStatus,
  PaymentType,
  ProductFileType,
  UserRole,
} from "src/enum";
import { PaymentHistoryService } from "src/payment-history/payment-history.service";
// import {
//   orderCancellation,
//   orderPlaced,
//   refundRequest,
// } from 'src/utils/sms.utils';
// import { WalletsService } from 'src/wallets/wallets.service';
import { UserAddress } from "src/user-address/entities/user-address.entity";
// import { generateUrl } from "src/utils/payment.util";
// import { instance } from "src/utils/razor-pay.utils";
import { instance } from "../utils/razor_pay.utils";
import { Brackets, Repository } from "typeorm";
import {
  CancelOrderDto,
  PlaceOrderDto,
  StatusDto,
} from "./dto/cart-status.dto";
import { PaginationDto } from "./dto/pagination-cart.dto";
import { Cart } from "./entities/cart.entity";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepo: Repository<CartProduct>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(UserAddress)
    private readonly udRepo: Repository<UserAddress>,
    private readonly paymentService: PaymentHistoryService,
    private readonly notifyService: NotifyService
    // private readonly deliveryService: DeliveryPartnersService,
  ) {}

  async create(
    accountId: string,
    createdBy: string,
    roles: UserRole,
    settingId: string
  ) {
    const result = this.cartRepo.findOne({
      select: ["id"],
      where: [
        { accountId, settingId, status: CartStatus.CART },
        { accountId, settingId, status: CartStatus.PAYMENT_PENDING },
      ],
    });
    if (!result) {
      return result;
    }
    const obj = Object.create({
      accountId,
      settingId,
      roles,
      adminAccountId: process.env.adminAccountId,
    });
    const payload = await this.cartRepo.save(obj);
    if (
      roles === UserRole.SCHOOL ||
      roles === UserRole.COLLEGE ||
      roles === UserRole.ORGANIZATION
    ) {
      this.assignPartner(payload, createdBy);
    }
    return payload;
  }

  async getAccount(id: string, roles: UserRole) {
    return this.accountRepo.findOne({
      where: { settingId: id, roles: roles },
    });
  }
  async assignPartner(cart: Cart, createdBy: string) {
    const account = await this.accountRepo.findOne({
      where: { id: createdBy },
    });
    if (account) {
      if (account.roles === UserRole.SUB_PARTNER) {
        const obj = Object.assign(cart, {
          partnerAccountId: account.createdBy,
          subPartnerAccountId: account.id,
        });
        this.cartRepo.save(obj);
      }
      if (account.roles === UserRole.PARTNER) {
        const obj = Object.assign(cart, {
          partnerAccountId: account.id,
        });
        this.cartRepo.save(obj);
      }
    }
  }

  async findByUser(
    accountId: string,
    settingId: string,
    role: UserRole,
    dto: PaginationDto
  ) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);
    const keyword = dto.keyword || "";
    const query = this.cartRepo
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.userAddress", "userAddress")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .leftJoinAndSelect("cart.account", "account")

      .leftJoinAndSelect("cart.cartProduct", "cartProduct")
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

      .leftJoinAndSelect("account.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("account.userDetail", "userDetail")
      .leftJoinAndSelect("cart.partnerAccount", "partnerAccount")
      .leftJoinAndSelect("partnerAccount.partnerDetail", "partnerDetail")
      .leftJoinAndSelect("cart.subPartnerAccount", "subPartnerAccount")
      .leftJoinAndSelect("subPartnerAccount.partnerDetail", "spartnerDetail")
      .select([
        "cart.id",
        "cart.orderId",
        "cart.status",
        "cart.orderDate",
        "cart.invoiceNumber",
        "cart.total",
        "cart.roles",
        "cart.createdAt",

        "userAddress.name",
        "userAddress.altPhone",
        "userAddress.phone",
        "userAddress.city",
        "userAddress.state",
        "userAddress.address",

        "paymentHistory.id",
        "paymentHistory.status",
        "paymentHistory.mode",

        "account.id",
        "account.settingId",

        "userDetail.id",
        "organizationDetail.id",

        "subPartnerAccount.id",
        "subPartnerAccount.settingId",
        "partnerAccount.id",
        "partnerAccount.settingId",

        "partnerDetail.id",
        "spartnerDetail.id",

        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",

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
        "cart.orderDate >= :fromDate AND cart.orderDate <= :toDate AND cart.status IN (:...status)",
        {
          fromDate: fromDate,
          toDate: toDate,
          status: [dto.status],
        }
      );

    if (role === UserRole.USER) {
      query.andWhere("cart.accountId = :accountId", { accountId: accountId });
    }
    if (role === UserRole.ROOT || role === UserRole.ADMIN) {
      query.andWhere("cart.adminAccountId = :adminAccountId", {
        adminAccountId: accountId,
      });
    }
    if (role === UserRole.PARTNER) {
      query.andWhere("cart.partnerAccountId = :partnerAccountId", {
        partnerAccountId: accountId,
      });
    }
    if (role === UserRole.SUB_PARTNER) {
      query.andWhere("cart.subPartnerAccountId = :subPartnerAccountId", {
        subPartnerAccountId: accountId,
      });
    }
    if (
      role === UserRole.SCHOOL ||
      role === UserRole.COLLEGE ||
      role === UserRole.ORGANIZATION
    ) {
      query.andWhere("cart.settingId = :settingId", {
        settingId: settingId,
      });
    }
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where("cart.orderId LIKE :orderId OR cart.accountId LIKE :aid", {
            orderId: "%" + keyword + "%",
            aid: "%" + keyword + "%",
          });
        })
      )
      .orderBy({ "cart.orderDate": "DESC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }


  async findListByUser(
    accountId: string,
    dto: CommonPaginationDto
  ) {
    const keyword = dto.keyword || "";
    const query = this.cartRepo
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")

      .leftJoinAndSelect("cart.cartProduct", "cartProduct")
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("cartProduct.cartProductVariant", "cartProductVariant")
      .leftJoinAndSelect("cartProductVariant.productVariant", "productVariant")
      .leftJoinAndSelect(
        "idCardsStock.productImage",
        "productImage",
        "productImage.type = :piType",
        { piType: ProductFileType.IMAGE }
      )
   
      .select([
        "cart.id",
        "cart.orderId",
        "cart.status",
        "cart.orderDate",
        "cart.invoiceNumber",
        "cart.total",
        "cart.roles",
        "cart.createdAt",

       
        "paymentHistory.id",
        "paymentHistory.status",
        "paymentHistory.mode",





        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",

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
      ])
     

      query.andWhere("cart.accountId = :accountId", { accountId: accountId });
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where("cart.orderId LIKE :orderId OR cart.accountId LIKE :aid", {
            orderId: "%" + keyword + "%",
            aid: "%" + keyword + "%",
          });
        })
      )
      .orderBy({ "cart.orderDate": "DESC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

      
    return { result, total };
  }

  async cancelOrder(
    id: string,
    // accountId: string,
    // phoneNumber: string,
    dto: CancelOrderDto
  ) {
    const result = await this.cartRepo
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("account.userDetail", "userDetail")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .select([
        "cart.id",
        // 'cart.paymentHistoryId',
        "cart.orderId",
        "cart.status",

        "account.id",
        "account.phoneNumber",
        "account.fcm",

        "userDetail.firstName",
        "paymentHistory.invoiceNumber",
        "paymentHistory.orderId",
        "paymentHistory.amount",
        "paymentHistory.wallet",
        "paymentHistory.total",
        "paymentHistory.status",
        "paymentHistory.mode",
      ])
      .where("cart.id = :id AND cart.status IN (:...status)", {
        id,
        status: [CartStatus.ORDERED, CartStatus.DISPATCH],
      })
      .getOne();

    if (!result) {
      throw new NotFoundException("Order not found!");
    }
    if (result.status !== CartStatus.ORDERED) {
      throw new NotAcceptableException(
        `Order already dispatched. This order can not be cancelled!`
      );
    }
    if (result.paymentHistory["status"] === PaymentStatus.COMPLETED) {
      // this.walletService.credit({
      //   accountId: accountId,
      //   cartId: result.id,
      //   coins: result.paymentHistory["total"],
      //   status: null,
      // });
      this.paymentService.updateCancelled(result.id, PaymentStatus.REFUNDED);
    } else {
      this.paymentService.updateCancelled(result.id, PaymentStatus.CANCELLED);
    }
    // this.notifyService.orderCancelled(
    //   result.account["phoneNumber"],
    //   result.account["fcm"],
    //   result.account["id"],
    //   result.account["userDetail"][0]["firstName"],
    //   result.orderId
    // );

    return this.cancelCartStatus(
      result.id,
      CartStatus.CANCELLED,
      null,
      dto.reason
    );
  }

  async placeOrder(dto: PlaceOrderDto, settingId: string, accountId: string) {
    const result = await this.cartRepo
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("account.userDetail", "userDetail")
      .leftJoinAndSelect(
        "account.userAddress",
        "userAddress",
        "userAddress.status = :addStatus",
        { addStatus: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect(
        "cart.cartProduct",
        "cartProduct",
        "cartProduct.status IN (:...cStatus)",
        { cStatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING] }
      )
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .select([
        "cart.id",

        "account.id",
        "account.fcm",
        "account.phoneNumber",

        "userDetail.firstName",

        "userAddress.id",
        "userAddress.name",
        "userAddress.altPhone",
        "userAddress.phone",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",

        "cartProduct.id",
        "cartProduct.quantity",
      ])
      .where("cart.settingId = :settingId AND cart.status IN  (:...statuses)", {
        settingId,
        statuses: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
      })
      .getOne();
    if (!result) {
      throw new NotFoundException("Cart is empty!");
    }
    console.log(result);
    if (!result.account["userAddress"][0]) {
      throw new NotAcceptableException("Please create order delivery address!");
    }

    let amount = 0;
    let discount = 0;
    let partnerDiscount = 0;
    let additionalDiscount = 0;
    let total = 0;
    let shippingCost = 0;

    result.cartProduct.forEach((element) => {
      amount += element["idCardsStock"]["price"] * element.quantity;
      discount += element["idCardsStock"]["discountedPrice"] * element.quantity;
      total += element["idCardsStock"]["finalPrice"] * element.quantity;
      partnerDiscount = element["idCardsStock"]["partnerDiscount"];
      additionalDiscount = element["idCardsStock"]["additionalDiscount"];
    });
    total = total + shippingCost;
    const orderId = "order-" + Date.now().toString();
    const invoiceNumber = "ST-" + Date.now().toString();
    const paymentObj = {
      orderId,
      invoiceNumber,
      amount,
      discount,
      gst: 18,
      total,
      status: PaymentStatus.PENDING,
      mode: dto.mode,
      cartId: result.id,
      accountId,
      paymentId: Date.now().toString(),
      shippingCharge: shippingCost,
    };
    const payment = await this.paymentService.create(paymentObj);
    // orderPlaced(phoneNumber, result.account['userDetail']?.firstName, orderId);
    const status =
      dto.mode === PaymentType.COD
        ? CartStatus.ORDERED
        : CartStatus.PAYMENT_PENDING;

    if (dto.mode === PaymentType.COD) {
      // this.notifyService.orderPlaced(
      //   result.account["phoneNumber"],
      //   result.account["fcm"],
      //   result.account["id"],
      //   orderId
      // );
      this.updateCartStatus(
        result.id,
        status,
        orderId,
        result.account["userAddress"][0]["id"],
        total,
        invoiceNumber
      );
      return { message: "Order Placed Successfully for CASH ON DELIVERY" };
    }
    this.updateCartStatus(
      result.id,
      status,
      orderId,
      result.account["userAddress"][0]["id"],
      total,
      invoiceNumber
    );

    // if (dto.mode === PaymentType.PHONE_PE) {
    //   return generateUrl(
    //     settingId,
    //     paymentObj.paymentId,
    //     +total * 100,
    //     phoneNumber,
    //     process.env.STN_CALLBACK_URL
    //   );
    // }
    // else if (dto.mode === PaymentType.RAZOR_PAY) {
    const options = {
      amount: +total * 100,
      currency: "INR",
      receipt: null,
      payment_capture: "0",
    };
    const payload = await instance().orders.create(options);
    if (payload.status === "created") {
      return { order: payload, paymentHistoryId: payment.id };
    } else {
      throw new NotAcceptableException(
        "Try after some time or user other payment methods!"
      );
    }
    // }
  }

  async placeUserOrder(dto: PlaceOrderDto, accountId: string) {
    const result = await this.cartRepo
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("account.userDetail", "userDetail")
      .leftJoinAndSelect(
        "account.userAddress",
        "userAddress",
        "userAddress.status = :addStatus",
        { addStatus: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect(
        "cart.cartProduct",
        "cartProduct",
        "cartProduct.status IN (:...cStatus)",
        { cStatus: [CartStatus.CART, CartStatus.PAYMENT_PENDING] }
      )
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .select([
        "cart.id",

        "account.id",
        "account.fcm",
        "account.phoneNumber",

        "userDetail.firstName",

        "userAddress.id",
        "userAddress.name",
        "userAddress.altPhone",
        "userAddress.phone",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",

        "cartProduct.id",
        "cartProduct.quantity",
      ])
      .where("cart.status IN  (:...statuses)", {
        statuses: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
      })
      .getOne();
    if (!result) {
      throw new NotFoundException("Cart is empty!");
    }
    console.log(result);
    if (!result.account["userAddress"][0]) {
      throw new NotAcceptableException("Please create order delivery address!");
    }

    let amount = 0;
    let discount = 0;
    let partnerDiscount = 0;
    let additionalDiscount = 0;
    let total = 0;
    let shippingCost = 0;

    result.cartProduct.forEach((element) => {
      amount += element["idCardsStock"]["price"] * element.quantity;
      discount += element["idCardsStock"]["discountedPrice"] * element.quantity;
      total += element["idCardsStock"]["finalPrice"] * element.quantity;
      partnerDiscount = element["idCardsStock"]["partnerDiscount"];
      additionalDiscount = element["idCardsStock"]["additionalDiscount"];
    });
    total = total + shippingCost;
    const orderId = "order-" + Date.now().toString();
    const invoiceNumber = "ST-" + Date.now().toString();
    const paymentObj = {
      orderId,
      invoiceNumber,
      amount,
      discount,
      gst: 18,
      total,
      status: PaymentStatus.PENDING,
      mode: dto.mode,
      cartId: result.id,
      accountId,
      paymentId: Date.now().toString(),
      shippingCharge: shippingCost,
    };
    const payment = await this.paymentService.create(paymentObj);
    // orderPlaced(phoneNumber, result.account['userDetail']?.firstName, orderId);
    const status =
      dto.mode === PaymentType.COD
        ? CartStatus.ORDERED
        : CartStatus.PAYMENT_PENDING;

    if (dto.mode === PaymentType.COD) {
      // this.notifyService.orderPlaced(
      //   result.account["phoneNumber"],
      //   result.account["fcm"],
      //   result.account["id"],
      //   orderId
      // );
      this.updateCartStatus(
        result.id,
        status,
        orderId,
        result.account["userAddress"][0]["id"],
        total,
        invoiceNumber
      );
      return { message: "Order Placed Successfully for CASH ON DELIVERY" };
    }
    this.updateCartStatus(
      result.id,
      status,
      orderId,
      result.account["userAddress"][0]["id"],
      total,
      invoiceNumber
    );

    // if (dto.mode === PaymentType.PHONE_PE) {
    //   return generateUrl(
    //     settingId,
    //     paymentObj.paymentId,
    //     +total * 100,
    //     phoneNumber,
    //     process.env.STN_CALLBACK_URL
    //   );
    // }
    // else if (dto.mode === PaymentType.RAZOR_PAY) {
    const options = {
      amount: +total * 100,
      currency: "INR",
      receipt: null,
      payment_capture: "0",
    };
    const payload = await instance().orders.create(options);
    if (payload.status === "created") {
      return { order: payload, paymentHistoryId: payment.id };
    } else {
      throw new NotAcceptableException(
        "Try after some time or user other payment methods!"
      );
    }
    // }
  }

  formatDate(date: Date): string {
    if (!date) return null;
    date = new Date(date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async updateCartStatus(
    cartId: string,
    status: CartStatus,
    orderId: string,
    addressId: string,
    total: number,
    invoiceNumber: string
    // paymentHistoryId: string,
  ) {
    this.cartProductRepo
      .createQueryBuilder()
      .update()
      .set({
        status: status,
      })
      .where("cartId = :cartId AND status = :status", {
        cartId: cartId,
        status: CartStatus.CART,
      })
      .execute();
    this.cartRepo
      .createQueryBuilder()
      .update()
      .set({
        status: status,
        orderDate: new Date(),
        orderId: orderId,
        userAddressId: addressId,
        invoiceNumber: invoiceNumber,
        total: total,
        // paymentHistoryId: paymentHistoryId,
      })
      .where("id = :id", { id: cartId })
      .execute();
  }

  async cancelCartStatus(
    cartId: string,
    status: CartStatus,
    pickupDate: Date,
    reason: string
  ) {
    this.cartProductRepo
      .createQueryBuilder()
      .update()
      .set({
        status: status,
      })
      .where("cartId = :cartId AND status = :status", {
        cartId: cartId,
        status: CartStatus.ORDERED,
      })
      .execute();
    return this.cartRepo
      .createQueryBuilder()
      .update()
      .set({
        pickupDate: pickupDate,
        status: status,
        cancelDate: new Date(),
        reason: reason,
      })
      .where("id = :id", { id: cartId })
      .execute();
  }

  async status(orderId: string, dto: StatusDto) {
    const result = await this.cartRepo
      .createQueryBuilder("cart")
      .leftJoinAndSelect("cart.account", "account")
      .leftJoinAndSelect("cart.paymentHistory", "paymentHistory")
      .leftJoinAndSelect(
        "account.userAddress",
        "userAddress",
        "userAddress.status = :addStatus",
        { addStatus: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect("cart.cartProduct", "cartProduct")
      .leftJoinAndSelect("cartProduct.idCardsStock", "idCardsStock")
      .select([
        "cart.id",
        "cart.invoiceNumber",
        "cart.total",
        "cart.orderId",
        "cart.accountId",

        "account.id",
        "account.phoneNumber",
        "account.fcm",

        "idCardsStock.id",
        "idCardsStock.price",
        "idCardsStock.discount",
        "idCardsStock.discountedPrice",
        "idCardsStock.finalPrice",
        "idCardsStock.title",
        "idCardsStock.code",

        "paymentHistory.id",

        "cartProduct.id",
        "cartProduct.quantity",
        "cartProduct.status",
      ])
      .where("cart.id = :id AND cart.status IN  (:...statuses)", {
        id: orderId,
        statuses: [CartStatus.ORDERED, CartStatus.DISPATCH],
      })
      .getOne();
    if (!result) {
      throw new NotFoundException("Order not found!");
    }
    if (dto.status === CartStatus.DISPATCH) {
      // this.notifyService.orderDispatch(
      //   result.account["phoneNumber"],
      //   result.account["fcm"],
      //   result.account["id"]
      // );
    }
    if (dto.status === CartStatus.DELIVERED) {
      // this.notifyService.orderDelivered(
      //   result.account["phoneNumber"],
      //   result.account["fcm"],
      //   result.account["id"]
      // );
    }

    if (dto.status === CartStatus.DELIVERED) {
      this.paymentService.updateCOD(result.id);
    }

    this.cartRepo
      .createQueryBuilder()
      .update()
      .set({
        status: dto.status,
      })
      .where("id = :cartId", { cartId: result.id })
      .execute();

    return this.cartProductRepo
      .createQueryBuilder()
      .update()
      .set({
        status: dto.status,
      })
      .where("cartId = :cartId", {
        cartId: result.id,
      })
      .execute();
  }

  async findActiveCart(accountId: string, settingId: string) {
    return this.cartRepo
      .createQueryBuilder("cart")
      .select(["cart.id"])
      .where(
        "cart.status IN (:...status) AND cart.accountId = :accountId AND cart.settingId = :settingId",
        {
          status: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
          accountId: accountId,
          settingId: settingId,
        }
      )
      .getOne();
  }
  async findUserActiveCart(accountId: string) {
    return this.cartRepo
      .createQueryBuilder("cart")
      .select(["cart.id"])
      .where(
        "cart.status IN (:...status) AND cart.accountId = :accountId ",
        {
          status: [CartStatus.CART, CartStatus.PAYMENT_PENDING],
          accountId: accountId,
        }
      )
      .getOne();
  }
}
