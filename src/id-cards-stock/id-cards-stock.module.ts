import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ClassList } from "src/class-list/entities/class-list.entity";
import { Designation } from "src/designation/entities/designation.entity";
import { HouseZone } from "src/house-zones/entities/house-zone.entity";
import { ProductVariantsModule } from "src/product-variants/product-variants.module";
import { StaffDetail } from "src/staff-details/entities/staff-detail.entity";
import { Student } from "src/students/entities/student.entity";
import { IdCardsStock } from "./entities/id-cards-stock.entity";
import { IdCardsStockController } from "./id-cards-stock.controller";
import { IdCardsStockService } from "./id-cards-stock.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IdCardsStock,
      ClassList,
      Designation,
      HouseZone,
      Student,
      StaffDetail,
    ]),
    AuthModule,
    ProductVariantsModule,
    MulterModule.register(),
  ],
  controllers: [IdCardsStockController],
  providers: [IdCardsStockService],
})
export class IdCardsStockModule {}
