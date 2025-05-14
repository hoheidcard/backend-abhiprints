import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ProductImage } from "./entities/product-image.entity";
import { ProductImagesController } from "./product-images.controller";
import { ProductImagesService } from "./product-images.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
})
export class ProductImagesModule {}
