import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartProduct } from "src/cart-product/entities/cart-product.entity";
import { Cart } from "src/carts/entities/cart.entity";
import {
  CartStatus,
  DefaultStatus,
  PaymentStatus,
  PaymentType,
} from "src/enum";
// import { NodeMailerService } from "src/node-mailer/node-mailer.service";
// import { orderPlaced } from "src/utils/sms.utils";
import { Brackets, Repository } from "typeorm";
import {
  PaginationDto,
  PayDto,
  PaymentHistoryDto,
} from "./dto/payment-history.dto";
import { PaymentHistory } from "./entities/payment-history.entity";

@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentRepo: Repository<PaymentHistory>,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepo: Repository<CartProduct>
  ) {}

  async create(dto: PaymentHistoryDto) {
    const result = await this.paymentRepo.findOne({
      where: {
        accountId: dto.accountId,
        cartId: dto.cartId,
      },
    });
    if (result) {
      return result;
    }
    const obj = Object.create(dto);
    return this.paymentRepo.save(obj);
  }

  async update(id: string, dto: PayDto) {
    const result = await this.paymentRepo.findOne({
      where: {
        paymentId: id,
      },
    });
    if (!result) {
      throw new NotFoundException(
        "Order not found. Try after some time or contact to admin!"
      );
    }
    if (result.status === PaymentStatus.COMPLETED) {
      throw new ConflictException("Payment already done!");
    }
    if (dto.status === PaymentStatus.COMPLETED) {
      this.updateCartStatus(result.cartId, CartStatus.ORDERED);
      const cartDetail = await this.cartRepo
        .createQueryBuilder("cart")
        .leftJoinAndSelect("cart.account", "account")
        .leftJoinAndSelect("account.userDetail", "userDetail")
        .leftJoinAndSelect(
          "account.userAddress",
          "userAddress",
          "userAddress.status = :addStatus",
          { addStatus: DefaultStatus.ACTIVE }
        )
        .select([
          "cart.id",
          "cart.orderId",

          "account.id",

          "userDetail.firstName",
          "userDetail.email",

          "userAddress.id",
          "userAddress.name",
          "userAddress.altPhone",
          "userAddress.phone",
          "userAddress.city",
          "userAddress.state",
          "userAddress.pincode",
          "userAddress.address",
        ])
        .where("cart.id = :id", {
          id: result.cartId,
        })
        .getOne();
      // this.nodeMailerService.ConfirmOrder(
      //   cartDetail.id,
      //   cartDetail.orderId,
      //   cartDetail.account["userAddress"][0]["name"],
      //   cartDetail.account["userDetail"]["email"]
      // );
      // orderPlaced(
      //   cartDetail.account["userAddress"][0]["phone"],
      //   cartDetail.account["userAddress"][0]["name"],
      //   cartDetail.orderId
      // );
    } else {
      this.updateCartStatus(result.cartId, CartStatus.PAYMENT_PENDING);
    }
    const obj = Object.assign(result, dto);
    return this.paymentRepo.save(obj);
  }

  async updateCOD(id: string) {
    const result = await this.paymentRepo.findOne({
      where: { cartId: id },
    });
    if (!result) {
      throw new NotFoundException("Order not found. Try after some time!");
    }
    const obj = Object.assign(result, { status: PaymentStatus.COMPLETED });
    return this.paymentRepo.save(obj);
  }

  async updateCancelled(id: string, status: PaymentStatus) {
    const result = await this.paymentRepo.findOne({
      where: { cartId: id },
    });
    if (!result) {
      throw new NotFoundException("Order not found. Try after some time!");
    }
    const obj = Object.assign(result, { status });
    return this.paymentRepo.save(obj);
  }

  async updateCartStatus(cartId: string, status: CartStatus) {
    this.cartProductRepo
      .createQueryBuilder()
      .update()
      .set({
        status: status,
      })
      .where("cartId = :cartId", { cartId: cartId })
      .execute();
    this.cartRepo
      .createQueryBuilder()
      .update()
      .set({
        status: status,
      })
      .where("id = :id", { id: cartId })
      .execute();
  }

  async findAll(dto: PaginationDto, accountId: string) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const [result, total] = await this.paymentRepo
      .createQueryBuilder("paymentHistory")
      .leftJoinAndSelect("paymentHistory.account", "account")
      .where(
        "paymentHistory.createdAt >= :fromDate AND paymentHistory.createdAt <= :toDate AND paymentHistory.accountId = :accountId",
        {
          fromDate: fromDate,
          toDate: toDate,
          accountId: accountId,
        }
      )
      .skip(dto.offset)
      .take(dto.limit)
      .orderBy({ "paymentHistory.createdAt": "DESC" })
      .getManyAndCount();
    return { result, total };
  }

  async find(dto: PaginationDto) {
    const keyword = dto.keyword || "";
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const [result, total] = await this.paymentRepo
      .createQueryBuilder("paymentHistory")
      .leftJoinAndSelect("paymentHistory.account", "account")
      .where(
        "paymentHistory.createdAt >= :fromDate AND paymentHistory.createdAt <= :toDate AND paymentHistory.status = :status AND paymentHistory.mode IN (:...type)",
        {
          fromDate: fromDate,
          toDate: toDate,
          status: dto.status,
          type:
            dto.type === PaymentType.ALL
              ? [PaymentType.COD, PaymentType.PHONE_PE]
              : [dto.type],
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "account.phoneNumber LIKE :phoneNumber OR paymentHistory.invoiceNumber LIKE :invoiceNumber OR paymentHistory.orderId LIKE :orderId",
            {
              phoneNumber: "%" + keyword + "%",
              invoiceNumber: "%" + keyword + "%",
              orderId: "%" + keyword + "%",
            }
          );
        })
      )
      .skip(dto.offset)
      .take(dto.limit)
      .orderBy({ "paymentHistory.createdAt": "DESC" })
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.paymentRepo
      .createQueryBuilder("paymentHistory")
      .leftJoinAndSelect("paymentHistory.cart", "cart")
      .leftJoinAndSelect("card.idCardStock", "idCardStock")
      .leftJoinAndSelect("cart.userAddress", "userAddress")
      .leftJoinAndSelect("cart.cartProduct", "cartProduct")
      .leftJoinAndSelect("cartProduct.cartProductVariant", "cartProductVariant")
      .leftJoinAndSelect("cartProductVariant.productVariant", "productVariant")
      .where("paymentHistory.id = :id", {
        id: id,
      })
      .getOne();

    if (!result) {
      throw new NotFoundException("Not found!");
    }
    return result;
  }

  async findTotal(dto: PaginationDto) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);
    const total = await this.paymentRepo
      .createQueryBuilder("paymentHistory")
      .select([
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :PENDING THEN paymentHistory.total ELSE 0 END), 0) AS pendingTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :COMPLETED THEN paymentHistory.total ELSE 0 END), 0) AS completedTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :FAILED THEN paymentHistory.total ELSE 0 END), 0) AS failedTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :CANCELLED THEN paymentHistory.total ELSE 0 END), 0) AS cancelledTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :PENDING THEN paymentHistory.wallet ELSE 0 END), 0) AS pendingWalletTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :COMPLETED THEN paymentHistory.wallet ELSE 0 END), 0) AS completedWalletTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :FAILED THEN paymentHistory.wallet ELSE 0 END), 0) AS failedWalletTotal",
        "COALESCE(SUM(CASE WHEN paymentHistory.status = :CANCELLED THEN paymentHistory.wallet ELSE 0 END), 0) AS cancelledWalletTotal",
      ])
      .where(
        "paymentHistory.createdAt >= :fromDate AND paymentHistory.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      )
      .setParameters({
        PENDING: "PENDING",
        COMPLETED: "COMPLETED",
        FAILED: "FAILED",
        CANCELLED: "CANCELLED",
      })
      .groupBy("paymentHistory.status")
      .getRawOne();
    if (total) {
      return total;
    } else {
      return {
        pendingTotal: 0,
        completedTotal: 0,
        failedTotal: 0,
        cancelledTotal: 0,
        pendingWalletTotal: 0,
        completedWalletTotal: 0,
        failedWalletTotal: 0,
        cancelledWalletTotal: 0,
      };
    }
  }
}
