import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/account/entities/account.entity";
import { AuthModule } from "src/auth/auth.module";
import { CartProduct } from "src/cart-product/entities/cart-product.entity";
// import { DeliveryPartnersModule } from 'src/delivery-partners/delivery-partners.module';
// import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';
import { PaymentHistoryModule } from "src/payment-history/payment-history.module";
// import { WalletsModule } from 'src/wallets/wallets.module';
import { NotifyModule } from "src/notify/notify.module";
import { UserAddress } from "src/user-address/entities/user-address.entity";
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
