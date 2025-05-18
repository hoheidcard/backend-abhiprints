import { StudentAttendance } from './../student-attendance/entities/student-attendance.entity';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../account/entities/account.entity";
import { AuthModule } from "../auth/auth.module";
import { Book } from "../books/entities/book.entity";
import { OrganizationDetail } from "../organization-details/entities/organization-detail.entity";
import { StaffDetail } from "../staff-details/entities/staff-detail.entity";
import { Student } from "../students/entities/student.entity";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { PartnerDetail } from "../partner-details/entities/partner-detail.entity";

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
