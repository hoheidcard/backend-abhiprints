import { StudentAttendance } from './../student-attendance/entities/student-attendance.entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/account/entities/account.entity";
import { AuthModule } from "src/auth/auth.module";
import { Book } from "src/books/entities/book.entity";
import { OrganizationDetail } from "src/organization-details/entities/organization-detail.entity";
import { StaffDetail } from "src/staff-details/entities/staff-detail.entity";
import { Student } from "src/students/entities/student.entity";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { PartnerDetail } from "src/partner-details/entities/partner-detail.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Student,
      StudentAttendance,
      Book,
      StaffDetail,
      OrganizationDetail,
      PartnerDetail
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
