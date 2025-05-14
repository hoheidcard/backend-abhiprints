import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { Category } from "./entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
