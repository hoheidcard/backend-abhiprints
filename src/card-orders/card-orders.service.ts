import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as archiver from "archiver";
import axios from "axios";
import { Account } from "../account/entities/account.entity";
import {
  BranchType,
  OrderFilterType,
  OrderStatus,
  OrderType,
  UserRole,
} from "../enum";
import { Notification } from "../notifications/entities/notification.entity";
import { OrganizationDetail } from "../organization-details/entities/organization-detail.entity";
import { Setting } from "../settings/entities/setting.entity";
import { StaffDetail } from "../staff-details/entities/staff-detail.entity";
import { Student } from "../students/entities/student.entity";
import { Between, Brackets, Repository } from "typeorm";
import {
  ORderStatusDto,
  StaffCardOrderDto,
  StudentCardOrderDto,
} from "./dto/card-order.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { CardOrderList } from "./entities/card-order-list.entity";
import { CardOrder } from "./entities/card-order.entity";
import { CardStudent } from "./entities/card-students.entity";

@Injectable()
export class CardOrdersService {
  constructor(
    @InjectRepository(CardOrder)
    private readonly cardOrderRepo: Repository<CardOrder>,
    @InjectRepository(CardOrderList)
    private readonly cardOrderListRepo: Repository<CardOrderList>,
    @InjectRepository(CardStudent)
    private readonly cardStudentRepo: Repository<CardStudent>,
    @InjectRepository(OrganizationDetail)
    private readonly organizationDetailRepo: Repository<OrganizationDetail>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(StaffDetail)
    private readonly staffDetailRepo: Repository<StaffDetail>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>
  ) {}

  async getStudent(
    classListId: string,
    cardOrderListId: string,
    cardOrderId: string
  ) {
    const student = await this.studentRepo.find({
      select: ["id"],
      where: { classListId, card: 0 },
    });
    const cards = [];
    student.forEach(async (element) => {
      const result = await this.cardStudentRepo.findOne({
        where: {
          studentId: element.id,
          cardOrderListId,
          fromYear: this.getCurrentAndNextYear().currentYear,
          toYear: this.getCurrentAndNextYear().nextYear,
          cardOrderId,
        },
      });
      if (!result) {
        this.studentRepo
          .createQueryBuilder()
          .update(Student)
          .set({ card: 1 })
          .where("id = :id", { id: element.id })
          .execute();
        this.cardStudentRepo.save({
          studentId: element.id,
          cardOrderListId,
          fromYear: this.getCurrentAndNextYear().currentYear,
          toYear: this.getCurrentAndNextYear().nextYear,
          cardOrderId,
        });
        this.notificationRepo.save({
          title: "Id Card",
          desc: "We are pleased to inform you that the ID cards are scheduled to go for print soon. This is the final call for any corrections or updates. Please review your ID card information and notify us of any changes",
          accountId: element.accountId,
        });
      }
    });
  }

  async createStudentOrder(dto: StudentCardOrderDto) {
    console.log(dto);
    const checkOrder = await this.cardOrderRepo.findOne({
      where: {
        staffAccountId: dto.staffAccountId,
        type: OrderType.STUDENT,
        settingId: dto.settingId,
        status: OrderStatus.PENDING,
      },
    });
    if (checkOrder) {
      throw new ConflictException("Order already created!");
    }
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 10);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date();
    toDate.setHours(23, 59, 59, 59);

    const orderCount = await this.cardOrderRepo.findOne({
      where: {
        settingId: dto.settingId,
        status: OrderStatus.PENDING,
        createdAt: Between(fromDate, toDate),
      },
    });
    const obj = Object.create({
      staffAccountId: dto.staffAccountId,
      type: OrderType.STUDENT,
      settingId: dto.settingId,
      parentCard: dto.parentCard,
      orderDate: new Date(),
      qty: dto.qty,
      deliveryDate: dto.deliveryDate,
      orderCount: orderCount ? orderCount.orderNumber + 1 : 1,
      deliveryAddress: dto.deliveryAddress,
      deliveryPartnerId: dto.deliveryPartnerId,
      contactNumber: dto.contactNumber,
      fromYear: this.getCurrentAndNextYear().currentYear,
      toYear: this.getCurrentAndNextYear().nextYear,
    });
    const order = await this.cardOrderRepo.save(obj);
    dto.classes.forEach(async (element) => {
      const obj = Object.create({
        classListId: element,
        cardOrderId: order.id,
        fromYear: this.getCurrentAndNextYear().currentYear,
        toYear: this.getCurrentAndNextYear().nextYear,
      });
      const result = await this.cardOrderListRepo.save(obj);
      this.getStudent(element, result.id, order.id);
    });
    return order;
    // return dto;
  }

  getCurrentAndNextYear() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    return { currentYear, nextYear };
  }

  async createStaffOrder(dto: StaffCardOrderDto) {
    const checkOrder = await this.cardOrderRepo.findOne({
      where: {
        staffAccountId: dto.staffAccountId,
        type: OrderType.STAFF,
        settingId: dto.settingId,
        status: OrderStatus.PENDING,
      },
    });
    if (checkOrder) {
      throw new ConflictException("Order already created!");
    }
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 10);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date();
    toDate.setHours(23, 59, 59, 59);

    const orderCount = await this.cardOrderRepo.findOne({
      where: {
        settingId: dto.settingId,
        status: OrderStatus.PENDING,
        createdAt: Between(fromDate, toDate),
      },
    });
    const obj = Object.create({
      staffAccountId: dto.staffAccountId,
      type: OrderType.STAFF,
      settingId: dto.settingId,
      orderDate: new Date(),
      orderCount: orderCount ? orderCount.orderNumber + 1 : 1,
      deliveryDate: dto.deliveryDate,
      deliveryPartnerId: dto.deliveryPartnerId,
      deliveryAddress: dto.deliveryAddress,
      qty: dto.qty,
      contactNumber: dto.contactNumber,
      fromYear: this.getCurrentAndNextYear().currentYear,
      toYear: this.getCurrentAndNextYear().nextYear,
    });
    const order = await this.cardOrderRepo.save(obj);
    const staffs = [];
    dto.staff.forEach((element) => {
      staffs.push({
        staffDetailId: element,
        cardOrderId: order.id,
        fromYear: this.getCurrentAndNextYear().currentYear,
        toYear: this.getCurrentAndNextYear().nextYear,
      });
    });
    this.cardOrderListRepo.save(staffs);
    return order;
  }

  findCSV(orgId: string) {
    return this.settingRepo
      .createQueryBuilder("setting")
      .leftJoinAndSelect("setting.organizationDetail", "organizationDetail")
      .where(
        "setting.id = :id OR organizationDetail.id = :organizationDetailId",
        { id: orgId, organizationDetailId: orgId }
      )
      .getOne();
  }

  findStaffForCsvOrg(orgId: string) {
    return this.staffDetailRepo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .where("staffDetail.settingId = :settingId", {
        settingId: orgId,
      })
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.cast",
        "staffDetail.religion",
        "staffDetail.photoNumber",
        "staffDetail.nationality",
        "staffDetail.contactNo",
        "staffDetail.altContactNo",
        "staffDetail.address",
        "staffDetail.city",
        "staffDetail.state",
        "staffDetail.pincode",
        "staffDetail.profile",
        "staffDetail.profileName",
        "staffDetail.gender",
        "staffDetail.dob",
        "staffDetail.joiningDate",
        "staffDetail.spouseName",
        "staffDetail.spouseContactNo",
        "staffDetail.spouseOccupation",
        "staffDetail.spouseIncome",
        "staffDetail.guardianRelation",
        "staffDetail.guardianName",
        "staffDetail.guardianContactNo",
        "staffDetail.guardianOccupation",
        "staffDetail.guardianIncome",

        "designation.name",

        "organizationDetail.name",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.address",
      ])
      .orderBy({ "staffDetail.name": "ASC" })
      .getMany();
  }

  findStaffForCsv(cardOrderId: string) {
    return this.staffDetailRepo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.cardOrderList", "cardOrderList")
      .where(
        "cardOrderList.id IS NOT NULL AND cardOrderList.cardOrderId = :cardOrderId",
        {
          cardOrderId,
        }
      )
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.cast",
        "staffDetail.religion",
        "staffDetail.photoNumber",
        "staffDetail.nationality",
        "staffDetail.contactNo",
        "staffDetail.altContactNo",
        "staffDetail.address",
        "staffDetail.city",
        "staffDetail.state",
        "staffDetail.pincode",
        "staffDetail.profile",
        "staffDetail.profileName",
        "staffDetail.gender",
        "staffDetail.dob",
        "staffDetail.joiningDate",
        "staffDetail.spouseName",
        "staffDetail.spouseContactNo",
        "staffDetail.spouseOccupation",
        "staffDetail.spouseIncome",
        "staffDetail.guardianRelation",
        "staffDetail.guardianName",
        "staffDetail.guardianContactNo",
        "staffDetail.guardianOccupation",
        "staffDetail.guardianIncome",
        "staffDetail.settingId",

        "designation.name",

        "organizationDetail.name",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.address",
      ])
      .orderBy({ "staffDetail.name": "ASC" })
      .getMany();
  }

  findStaffOrgForImage(settingId: string) {
    return (
      this.staffDetailRepo
        .createQueryBuilder("staffDetail")
        .leftJoinAndSelect(
          "staffDetail.organizationDetail",
          "organizationDetail"
        )
        // .leftJoinAndSelect("staffDetail.designation", "designation")
        .select([
          "staffDetail.id",
          "staffDetail.profile",
          "organizationDetail.image",
        ])
        .where("staffDetail.settingId = :settingId", {
          settingId: settingId,
        })
        .orderBy({ "staffDetail.name": "ASC" })
        .getMany()
    );
  }

  findStaffForImage(cardOrderId: string) {
    return this.staffDetailRepo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.cardOrderList", "cardOrderList")
      .where(
        "cardOrderList.id IS NOT NULL AND cardOrderList.cardOrderId = :cardOrderId",
        {
          cardOrderId,
        }
      )
      .select(["staffDetail.profile", "organizationDetail.image"])
      .orderBy({ "staffDetail.name": "ASC" })
      .getMany();
  }

  findStudentForCsvOrg(organizationId: string, classId: string) {
    const classes = JSON.parse(classId);
    return this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId IN (:...classId)",
        {
          organizationDetailId: organizationId,
          classId: classes ? classes : [],
        }
      )
      .select([
        "student.id",
        "student.regNo",
        "student.srNo",
        "student.UID",
        "student.PEN",
        "student.photoNumber",
        "student.studentNo",
        "student.admissionNo",
        "student.rollNo",
        "student.rfidNo",
        "student.name",
        "student.aadharNumber",
        "student.emailId",
        "student.guardianRelation",
        "student.cast",
        "student.religion",
        "student.nationality",
        "student.contactNo",
        "student.altContactNo",
        "student.emergencyNumber",
        "student.bloodGroup",
        "student.address",
        "student.city",
        "student.state",
        "student.pincode",
        "student.profile",
        "student.fatherImage",
        "student.motherImage",
        "student.guardianImage",
        "student.gender",
        "student.dob",
        "student.fatherName",
        "student.fatherContactNo",
        "student.fatherOccupation",
        "student.fatherIncome",
        "student.motherName",
        "student.motherContactNo",
        "student.motherOccupation",
        "student.motherIncome",
        "student.guardianName",
        "student.guardianContactNo",
        "student.guardianOccupation",
        "student.guardianIncome",

        "classList.name",
        "classDiv.name",
        "houseZone.name",

        "organizationDetail.name",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.address",
      ])
      .orderBy({ "classList.priority": "ASC", "student.name": "ASC" })
      .getMany();
  }

  findStudentForCsv(cardOrderId: string) {
    console.log(cardOrderId);
    return this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.cardStudent", "cardStudent")
      .leftJoinAndSelect("cardStudent.cardOrderList", "cardOrderList")
      .select([
        "student.id",
        "student.regNo",
        "student.srNo",
        "student.UID",
        "student.PEN",
        "student.photoNumber",
        "student.studentNo",
        "student.admissionNo",
        "student.rollNo",
        "student.rfidNo",
        "student.name",
        "student.aadharNumber",
        "student.emailId",
        "student.guardianRelation",
        "student.cast",
        "student.religion",
        "student.nationality",
        "student.contactNo",
        "student.altContactNo",
        "student.emergencyNumber",
        "student.bloodGroup",
        "student.address",
        "student.city",
        "student.state",
        "student.pincode",
        "student.profile",
        "student.fatherImage",
        "student.motherImage",
        "student.guardianImage",
        "student.gender",
        "student.dob",
        "student.fatherName",
        "student.fatherContactNo",
        "student.fatherOccupation",
        "student.fatherIncome",
        "student.motherName",
        "student.motherContactNo",
        "student.motherOccupation",
        "student.motherIncome",
        "student.guardianName",
        "student.guardianContactNo",
        "student.guardianOccupation",
        "student.guardianIncome",
        "student.settingId",

        "classList.name",
        "classDiv.name",
        "houseZone.name",

        "organizationDetail.name",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.address",
      ])
      .where(
        "student.card = :idCardStatus AND cardStudent.id IS NOT NULL AND cardOrderList.cardOrderId = :cardOrderId",
        {
          idCardStatus: 1,
          cardOrderId,
        }
      )
      .orderBy({ "classList.priority": "ASC", "student.name": "ASC" })
      .getMany();
  }

  findStudentOrgForImage(organizationId: string, classId: string) {
    const classes = JSON.parse(classId);
    return this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.cardStudent", "cardStudent")
      .leftJoinAndSelect("cardStudent.cardOrderList", "cardOrderList")
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId IN (:...classId)",
        {
          organizationDetailId: organizationId,
          classId: classes ? classes : [],
        }
      )
      .select([
        "student.profile",
        "student.fatherImage",
        "student.motherImage",
        "student.guardianImage",
        "organizationDetail.image",
      ])
      .orderBy({ "classList.priority": "ASC", "student.name": "ASC" })
      .getMany();
  }

  findStudentForImage(cardOrderId: string) {
    return this.studentRepo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.cardStudent", "cardStudent")
      .leftJoinAndSelect("cardStudent.cardOrderList", "cardOrderList")
      .where(
        "student.card = :idCardStatus AND cardStudent.id IS NOT NULL AND cardOrderList.cardOrderId = :cardOrderId",
        {
          idCardStatus: true,
          cardOrderId,
        }
      )
      .select([
        "student.profile",
        "student.fatherImage",
        "student.motherImage",
        "student.guardianImage",
        "organizationDetail.image",
      ])
      .orderBy({ "classList.priority": "ASC", "student.name": "ASC" })
      .getMany();
  }

  async findAll(
    dto: PaginationDto,
    accountId: string,
    role: UserRole,
    settingId: string
  ) {
    const keyword = dto.keyword || "";
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);
    const query = this.cardOrderRepo
      .createQueryBuilder("cardOrder")
      .leftJoinAndSelect("cardOrder.setting", "setting")
      .leftJoinAndSelect("setting.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .leftJoinAndSelect("cardOrder.cardOrderList", "cardOrderList")
      .leftJoinAndSelect("cardOrderList.classList", "classList")
      .leftJoinAndSelect("classList.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("cardOrderList.staffDetail", "sStaffDetail")
      .leftJoinAndSelect("sStaffDetail.designation", "designation")
      .leftJoinAndSelect("cardOrder.staffAccount", "staffAccount")
      .leftJoinAndSelect("staffAccount.staffDetail", "staffDetail")
      .leftJoinAndSelect("cardOrder.subPartnerAccount", "subPartnerAccount")
      .leftJoinAndSelect("subPartnerAccount.partnerDetail", "sPartnerDetail")
      .leftJoinAndSelect("cardOrder.partnerAccount", "partnerAccount")
      .leftJoinAndSelect("partnerAccount.partnerDetail", "partnerDetail")
      .select([
        "cardOrder.id",
        "cardOrder.orderNumber",
        "cardOrder.qty",
        "cardOrder.contactNumber",
        "cardOrder.orderDate",
        "cardOrder.deliveryDate",
        "cardOrder.fromYear",
        "cardOrder.toYear",
        "cardOrder.deliveryAddress",
        "cardOrder.parentCard",
        "cardOrder.status",
        "cardOrder.type",
        "cardOrder.createdAt",

        "cardOrderList.id",

        "classList.id",
        "classList.name",

        "idCardsStock.id",
        "idCardsStock.title",
        "idCardsStock.image",

        "setting.id",

        "organizationDetail.id",
        "organizationDetail.name",

        "account.id",
        "account.roles",

        "staffAccount.id",
        "subPartnerAccount.id",
        "partnerAccount.id",

        "staffDetail.id",
        "staffDetail.name",

        "partnerDetail.id",
        "partnerDetail.firmName",

        "sPartnerDetail.id",
        "sPartnerDetail.firmName",
      ]);
    query.where("cardOrder.status= :status", {
      status: dto.status,
    });
    if (
      role === UserRole.COLLEGE ||
      role === UserRole.ORGANIZATION ||
      role === UserRole.SCHOOL
    ) {
      query.andWhere("cardOrder.settingId = :settingId", {
        settingId,
      });
    }
    if (role === UserRole.PARTNER) {
      query.andWhere("cardOrder.partnerAccountId = :accountId", {
        accountId,
      });
    }
    if (role === UserRole.SUB_PARTNER) {
      query.andWhere("cardOrder.subPartnerAccountId = :accountId", {
        accountId,
      });
    }
    if (role === UserRole.ADMIN || role === UserRole.ROOT) {
      query.andWhere("cardOrder.adminAccountId = :accountId", {
        accountId,
      });
    }
    if (keyword.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where(
              "organizationDetail.name LIKE :name OR partnerDetail.firmName LIKE :partnerName OR sPartnerDetail.firmName LIKE :sPartnerName",
              {
                name: "%" + keyword + "%",
                partnerName: "%" + keyword + "%",
                sPartnerName: "%" + keyword + "%",
              }
            );
          }
        })
      );
    } else {
      if (dto.filterType === OrderFilterType.DELIVERY_DATE) {
        query.andWhere(
          "cardOrder.deliveryDate >= :fromDate AND cardOrder.deliveryDate <= :toDate",
          {
            fromDate: fromDate,
            toDate: toDate,
          }
        );
      } else if (dto.filterType === OrderFilterType.ORDER_DATE) {
        query.andWhere(
          "cardOrder.orderDate >= :fromDate AND cardOrder.orderDate <= :toDate",
          {
            fromDate: fromDate,
            toDate: toDate,
          }
        );
      }
    }
    const [result, total] = await query
      .orderBy({ "cardOrder.createdAt": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async assignSchoolToUpper(id: string) {
    const result = await this.cardOrderRepo.findOne({ where: { id } });
    const organization = await this.organizationDetailRepo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["organizationDetail.id", "account.createdBy"])
      .where(
        "organizationDetail.type = :branchType AND organizationDetail.settingId = :settingId",
        {
          branchType: BranchType.MAIN,
          settingId: result.settingId,
        }
      )
      .getOne();
    const account = await this.accountRepo
      .createQueryBuilder("account")
      .select(["account.id", "account.roles"])
      .where("account.id = :id", {
        id: organization.account["createdBy"],
      })
      .getOne();
    if (account.roles === UserRole.SUB_PARTNER) {
      const obj = Object.assign(result, {
        subPartnerAccountId: account.id,
        orderDate: new Date(),
      });
      return this.cardOrderRepo.save(obj);
    }
    if (account.roles === UserRole.PARTNER) {
      const obj = Object.assign(result, {
        partnerAccountId: account.id,
        orderDate: new Date(),
      });
      return this.cardOrderRepo.save(obj);
    }
    if (account.roles === UserRole.ADMIN || account.roles === UserRole.ROOT) {
      const obj = Object.assign(result, {
        adminAccountId: account.id,
        orderDate: new Date(),
      });
      return this.cardOrderRepo.save(obj);
    }
  }

  async assignSubPartnerToUpper(id: string, accountId: string) {
    const account = await this.accountRepo
      .createQueryBuilder("account")
      .select(["account.id", "account.roles", "account.createdBy"])
      .where("account.id = :id", {
        id: accountId,
      })
      .getOne();
    const result = await this.cardOrderRepo.findOne({ where: { id } });
    if (account.roles === UserRole.PARTNER) {
      const obj = Object.assign(result, { partnerAccountId: account.id });
      return this.cardOrderRepo.save(obj);
    }
    if (account.roles === UserRole.ADMIN || account.roles === UserRole.ROOT) {
      const obj = Object.assign(result, { adminAccountId: account.id });
      return this.cardOrderRepo.save(obj);
    }
  }

  async assignPartnerToUpper(id: string, accountId: string) {
    const account = await this.accountRepo
      .createQueryBuilder("account")
      .select(["account.id", "account.roles", "account.createdBy"])
      .where("account.id = :id", {
        id: accountId,
      })
      .getOne();
    const result = await this.cardOrderRepo.findOne({ where: { id } });
    if (account.roles === UserRole.ADMIN || account.roles === UserRole.ROOT) {
      const obj = Object.assign(result, { adminAccountId: account.id });
      return this.cardOrderRepo.save(obj);
    }
  }

  async findDetail(id: string) {
    const result = await this.cardOrderRepo
      .createQueryBuilder("cardOrder")
      .leftJoinAndSelect("cardOrder.setting", "setting")
      .leftJoinAndSelect(
        "setting.organizationDetail",
        "organizationDetail",
        "organizationDetail.type = :type",
        {
          type: BranchType.MAIN,
        }
      )
      .leftJoinAndSelect("cardOrder.cardOrderList", "cardOrderList")
      .leftJoinAndSelect("cardOrderList.classList", "classList")
      .leftJoinAndSelect("cardOrderList.staffDetail", "sStaffDetail")
      .leftJoinAndSelect("sStaffDetail.designation", "designation")
      .leftJoinAndSelect("cardOrder.staffAccount", "staffAccount")
      .leftJoinAndSelect("staffAccount.staffDetail", "staffDetail")
      .leftJoinAndSelect("staffAccount.subPartnerAccount", "subPartnerAccount")
      .leftJoinAndSelect("subPartnerAccount.partnerDetail", "sPartnerDetail")
      .leftJoinAndSelect("staffAccount.partnerAccount", "partnerAccount")
      .leftJoinAndSelect("partnerAccount.partnerDetail", "partnerDetail")
      .select([
        "cardOrder.id",
        "cardOrder.status",
        "cardOrder.createdAt",
        "cardOrderList.id",

        "classList.id",
        "classList.name",

        "sStaffDetail.id",
        "sStaffDetail.name",
        "designation.id",
        "designation.name",

        "setting.id",

        "organizationDetail.id",
        "organizationDetail.name",

        "staffAccount.id",
        "subPartnerAccount.id",
        "partnerAccount.id",

        "staffDetail.id",
        "staffDetail.name",

        "partnerDetail.id",
        "partnerDetail.name",

        "sPartnerDetail.id",
        "sPartnerDetail.name",
      ])
      .where("cardOrder.id = :id", { id })
      .getOne();
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async findOne(id: string) {
    const result = await this.cardOrderRepo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async updateStudent(id: string, card: number) {
    this.studentRepo
      .createQueryBuilder()
      .update(Student)
      .set({ card: 3 })
      .where("id = :id and card = :card", { id, card: 2 })
      .execute();
    this.studentRepo
      .createQueryBuilder()
      .update(Student)
      .set({ card: 2 })
      .where("id = :id and card = :card", { id, card: 1 })
      .execute();
  }

  async updateStaff(id: string, card: number) {
    this.staffDetailRepo
      .createQueryBuilder()
      .update(StaffDetail)
      .set({ card: 3 })
      .where("id = :id and card = :card", { id, card: 2 })
      .execute();
    this.staffDetailRepo
      .createQueryBuilder()
      .update(StaffDetail)
      .set({ card: 2 })
      .where("id = :id and card = :card", { id, card: 1 })
      .execute();
  }

  async status(id: string, dto: ORderStatusDto) {
    const result = await this.findOne(id);
    if (result.status == OrderStatus.COMPLETED) {
      throw new NotAcceptableException(`You can not change to ${dto.status}!`);
    }
    if (result.type === OrderType.STUDENT) {
      if (dto.status === OrderStatus.COMPLETED) {
        const student = await this.cardStudentRepo.find({
          select: ["studentId"],
          where: { cardOrderId: id },
        });
        student.forEach((element) => {
          this.updateStudent(element.studentId, 2);
        });
      }
      if (dto.status === OrderStatus.CANCELLED) {
        const student = await this.cardStudentRepo.find({
          select: ["studentId"],
          where: { cardOrderId: id },
        });
        student.forEach((element) => {
          this.updateStudent(element.studentId, 0);
        });
      }
    }
    if (result.type === OrderType.STAFF) {
      if (dto.status === OrderStatus.COMPLETED) {
        const student = await this.cardOrderListRepo.find({
          select: ["staffDetailId"],
          where: { cardOrderId: id },
        });
        student.forEach((element) => {
          this.updateStaff(element.staffDetailId, 2);
        });
      }
      if (dto.status === OrderStatus.CANCELLED) {
        const student = await this.cardOrderListRepo.find({
          select: ["staffDetailId"],
          where: { cardOrderId: id },
        });
        student.forEach((element) => {
          this.updateStaff(element.staffDetailId, 0);
        });
      }
    }
    const obj = Object.assign(result, dto);
    return this.cardOrderRepo.save(obj);
  }

  async downloadImage(
    url: string
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileName = url.substring(url.lastIndexOf("/") + 1);
    return { buffer: Buffer.from(response.data, "binary"), fileName };
  }

  async downloadImagesFromCDN(
    urls: string[]
  ): Promise<{ buffer: Buffer; fileName: string }[]> {
    const imageDownloads = await Promise.all(
      urls.map((url) => this.downloadImage(url))
    );
    return imageDownloads;
  }

  async createZip(
    images: { buffer: Buffer; fileName: string }[]
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const zip = archiver("zip");
      const buffers: Buffer[] = [];

      zip.on("error", (err: Error) => {
        reject(err);
      });

      images.forEach(({ buffer, fileName }) => {
        zip.append(buffer, { name: fileName.split(".")[0] + ".jpg" });
      });

      zip.on("data", (data: Buffer) => {
        buffers.push(data);
      });

      zip.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      zip.finalize();
    });
  }
}
