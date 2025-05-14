import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CartsModule } from 'src/carts/carts.module';
import { CartProductController } from './cart-product.controller';
import { CartProductService } from './cart-product.service';
import { CartProductVariant } from './entities/cart-product-variant.entity';
import { CartProduct } from './entities/cart-product.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartProduct, CartProductVariant]),
    AuthModule,
    CartsModule,
    MulterModule.register({ dest: './uploads/brand' }),
  ],
  controllers: [CartProductController],
  providers: [CartProductService],
  exports:[CartProductService]
})
export class CartProductModule {}
