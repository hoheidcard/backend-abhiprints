import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CartProduct } from "../cart-product/entities/cart-product.entity";
import { Cart } from "../carts/entities/cart.entity";
import { PaymentHistory } from "./entities/payment-history.entity";
import { PaymentHistoryController } from "./payment-history.controller";
import { PaymentHistoryService } from "./payment-history.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentHistory, Cart, CartProduct]),
    AuthModule,
  ],
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
