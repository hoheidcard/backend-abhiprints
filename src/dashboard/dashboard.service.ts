import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../account/entities/account.entity";
import { Book } from "../books/entities/book.entity";
import { DefaultStatus, UserRole } from "../enum";
import { OrganizationDetail } from "../organization-details/entities/organization-detail.entity";
import { PartnerDetail } from "../partner-details/entities/partner-detail.entity";
import { StaffDetail } from "../staff-details/entities/staff-detail.entity";
import { Student } from "../students/entities/student.entity";
import { Repository } from "typeorm";
import { StudentAttendance } from "./../student-attendance/entities/student-attendance.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(StaffDetail)
    private readonly staffDetailRepo: Repository<StaffDetail>,
    @InjectRepository(PartnerDetail)
    private readonly partnerDetailRepo: Repository<PartnerDetail>,
    @InjectRepository(OrganizationDetail)
    private readonly organizationDetailRepo: Repository<OrganizationDetail>,
    @InjectRepository(StudentAttendance)
    private readonly studentAttendanceRepo: Repository<StudentAttendance>
  ) {}

  async countDashboard(fDate: string, tDate: string, all: string) {
    const fromDate = new Date(fDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(tDate);
    toDate.setHours(23, 59, 59, 59);

    const query = this.accountRepo
      .createQueryBuilder("account")
      .select(["account.roles as roles", "COUNT(*) AS count"])
      .where("account.status = :status", {
        status: DefaultStatus.ACTIVE,
      });
    if (all == "No") {
      query.andWhere(
        "account.createdAt >= :fromDate AND account.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const accountCount = await query.groupBy("account.roles").getRawMany();

    const query1 = this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.status = :status", {
        status: DefaultStatus.ACTIVE,
      });
    if (all == "No") {
      query1.andWhere(
        "student.createdAt >= :fromDate AND student.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const studentCount = await query1.getRawOne();
    return { accountCount, studentCount };
  }

  async countOrganizationDashboard(
    settingId: string,
    organizationId: string,
    fDate: string,
    tDate: string,
    all: string
  ) {
    const fromDate = new Date(fDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(tDate);
    toDate.setHours(23, 59, 59, 59);

    const query = this.staffDetailRepo
      .createQueryBuilder("staffDetail")
      // .leftJoinAndSelect("staffDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where(
        "staffDetail.status = :status AND staffDetail.organizationDetailId = :organizationId",
        {
          status: DefaultStatus.ACTIVE,
          organizationId: organizationId,
        }
      );
    if (all == "No") {
      query.andWhere(
        "staffDetail.createdAt >= :fromDate AND staffDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const accountCount = await query.getRawOne();

    const query1 = this.studentRepo
      .createQueryBuilder("student")
      // .leftJoinAndSelect("student.account", "account")
      .select(["COUNT(*) AS count"])
      .where("student.organizationDetailId = :organizationId", {
        // status: DefaultStatus.ACTIVE,
        organizationId: organizationId,
      });
    if (all == "No") {
      query1.andWhere(
        "student.createdAt >= :fromDate AND student.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const studentCount = await query1.getRawOne();

    const query2 = this.studentRepo
      .createQueryBuilder("student")
      //   .leftJoinAndSelect("student.account", "account")
      .select(["COUNT(*) AS count"])
      .where(
        "student.organizationDetailId = :organizationId AND student.card = :card",
        {
          //   status: DefaultStatus.ACTIVE,
          organizationId: organizationId,
          card: true,
        }
      );
    if (all == "No") {
      query1.andWhere(
        "student.createdAt >= :fromDate AND student.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const studentCardCount = await query2.getRawOne();

    const query3 = this.organizationDetailRepo
      .createQueryBuilder("organizationDetail")
      //   .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("organizationDetail.organizationId = :organizationId", {
        //   status: DefaultStatus.ACTIVE,
        organizationId: organizationId,
      });
    if (all == "No") {
      query1.andWhere(
        "organizationDetail.createdAt >= :fromDate AND organizationDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const branchCount = await query3.getRawOne();

    const query4 = this.bookRepo
      .createQueryBuilder("book")
      .select(["COUNT(*) AS count"])
      .where("book.status = :status AND book.settingId = :settingId", {
        status: DefaultStatus.ACTIVE,
        settingId: settingId,
      });
    if (all == "No") {
      query1.andWhere(
        "book.createdAt >= :fromDate AND book.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const bookCount = await query4.getRawOne();

    const query5 = this.studentAttendanceRepo
      .createQueryBuilder("studentAttendance")
      .leftJoinAndSelect("studentAttendance.student", "student")
      //   .leftJoinAndSelect("student.account", "account")
      .select(["COUNT(*) AS count"])
      .where("student.settingId = :settingId", {
        // status: DefaultStatus.ACTIVE,
        settingId: settingId,
      });
    if (all == "No") {
      query1.andWhere(
        "studentAttendance.createdAt >= :fromDate AND studentAttendance.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const studentAttendanceCount = await query5.getRawOne();

    return {
      accountCount,
      studentCount,
      studentCardCount,
      studentAttendanceCount,
      branchCount,
      bookCount,
    };
  }

  async countPartnerDashboard(
    partnerDetailId: string,
    partnerAccountId: string,
    fDate: string,
    tDate: string,
    all: string
  ) {
    const fromDate = new Date(fDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(tDate);
    toDate.setHours(23, 59, 59, 59);

    const query = this.staffDetailRepo
      .createQueryBuilder("staffDetail")
      // .leftJoinAndSelect("staffDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where(
        "staffDetail.status = :status AND staffDetail.partnerDetailId = :partnerDetailId",
        {
          status: DefaultStatus.ACTIVE,
          partnerDetailId: partnerDetailId,
        }
      );
    if (all == "No") {
      query.andWhere(
        "staffDetail.createdAt >= :fromDate AND staffDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const accountCount = await query.getRawOne();

    const query6 = this.partnerDetailRepo
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.createdBy = :createdBy", {
        // status: DefaultStatus.ACTIVE,
        createdBy: partnerAccountId,
      });
    if (all == "No") {
      query6.andWhere(
        "partnerDetail.createdAt >= :fromDate AND partnerDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const partnerCount = await query6.getRawOne();

    const query1 = this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.createdBy = :createdBy", {
        // status: DefaultStatus.ACTIVE,
        createdBy: partnerAccountId,
      });
    if (all == "No") {
      query1.andWhere(
        "student.createdAt >= :fromDate AND student.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const studentCount = await query1.getRawOne();

    const query2 = this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.createdBy = :createdBy AND student.card = :card", {
        //   status: DefaultStatus.ACTIVE,
        createdBy: partnerAccountId,
        card: true,
      });
    if (all == "No") {
      query1.andWhere(
        "student.createdAt >= :fromDate AND student.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const studentCardCount = await query2.getRawOne();

    const query3 = this.organizationDetailRepo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.createdBy = :createdBy AND account.roles = :roles", {
        roles: UserRole.SCHOOL,
        createdBy: partnerAccountId,
      });
    if (all == "No") {
      query1.andWhere(
        "organizationDetail.createdAt >= :fromDate AND organizationDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const schoolCount = await query3.getRawOne();

    const query4 = this.organizationDetailRepo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.createdBy = :createdBy AND account.roles = :roles", {
        roles: UserRole.COLLEGE,
        createdBy: partnerAccountId,
      });
    if (all == "No") {
      query4.andWhere(
        "organizationDetail.createdAt >= :fromDate AND organizationDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const collegeCount = await query4.getRawOne();

    const query5 = this.organizationDetailRepo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["COUNT(*) AS count"])
      .where("account.createdBy = :createdBy AND account.roles = :roles", {
        roles: UserRole.ORGANIZATION,
        createdBy: partnerAccountId,
      });
    if (all == "No") {
      query5.andWhere(
        "organizationDetail.createdAt >= :fromDate AND organizationDetail.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const organizationCount = await query5.getRawOne();

    return {
      accountCount,
      studentCount,
      partnerCount,
      studentCardCount,
      schoolCount,
      collegeCount,
      organizationCount,
    };
  }
}
