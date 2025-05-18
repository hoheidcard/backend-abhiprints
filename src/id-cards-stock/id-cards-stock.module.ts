import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { ClassList } from "../class-list/entities/class-list.entity";
import { Designation } from "../designation/entities/designation.entity";
import { HouseZone } from "../house-zones/entities/house-zone.entity";
import { ProductVariantsModule } from "../product-variants/product-variants.module";
import { StaffDetail } from "../staff-details/entities/staff-detail.entity";
import { Student } from "../students/entities/student.entity";
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
