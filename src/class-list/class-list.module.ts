import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Student } from "src/students/entities/student.entity";
import { ClassListController } from "./class-list.controller";
import { ClassListService } from "./class-list.service";
import { ClassListDiv } from "./entities/class-list-div.entity";
import { ClassList } from "./entities/class-list.entity";
import { IdCardsStock } from "src/id-cards-stock/entities/id-cards-stock.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassList, ClassListDiv, Student, IdCardsStock]),
    AuthModule,
  ],
  controllers: [ClassListController],
  providers: [ClassListService],
  exports: [ClassListService],
})
export class ClassListModule {}
