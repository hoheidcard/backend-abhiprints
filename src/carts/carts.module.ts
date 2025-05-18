import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../account/entities/account.entity";
import { AuthModule } from "../auth/auth.module";
import { CartProduct } from "../cart-product/entities/cart-product.entity";
// import { DeliveryPartnersModule } from '../delivery-partners/delivery-partners.module';
// import { NodeMailerModule } from '../node-mailer/node-mailer.module';
import { PaymentHistoryModule } from "../payment-history/payment-history.module";
// import { WalletsModule } from '../wallets/wallets.module';
import { NotifyModule } from "../notify/notify.module";
import { UserAddress } from "../user-address/entities/user-address.entity";
import { CartsController } from "./carts.controller";
import { CartsService } from "./carts.service";
import { Cart } from "./entities/cart.entity";
import { OtherCartsController } from "./acarts.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct, Account, UserAddress]),
    AuthModule,
    PaymentHistoryModule,
    NotifyModule,
    // DeliveryPartnersModule,
    // NodeMailerModule,
  ],
  controllers: [CartsController, OtherCartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
