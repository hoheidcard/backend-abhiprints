import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/account/entities/account.entity";
import { ClassDiv } from "src/class-div/entities/class-div.entity";
import { ClassList } from "src/class-list/entities/class-list.entity";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus, UserRole } from "src/enum";
import { HouseZone } from "src/house-zones/entities/house-zone.entity";
import { PaginationDtoWithDate } from "src/organization-details/dto/pagination.dto";
import { Brackets, Repository } from "typeorm";
import {
  CreateStudentDto,
  PromoteClassDto,
  StudentCardDto,
} from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { Student } from "./entities/student.entity";

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private readonly repo: Repository<Student>,
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(ClassDiv)
    private readonly classDivRepo: Repository<ClassDiv>,
    @InjectRepository(ClassList)
    private readonly classListRepo: Repository<ClassList>,
    @InjectRepository(HouseZone)
    private readonly houseZoneRepo: Repository<HouseZone>
  ) {}

  async createCSV(dto: any, organizationDetailId: string, settingId: string) {
    try {
      if (dto.contactNo) {
        let user = await this.accountRepo.findOne({
          where: { phoneNumber: dto.contactNo, roles: UserRole.STUDENT },
        });
        if (!user) {
          const accObj = Object.create({
            phoneNumber: dto.contactNo,
            roles: UserRole.STUDENT,
            settingId,
            createdBy: dto.updatedId,
          });
          user = await this.accountRepo.save(accObj);
        }
        dto.accountId = user.id;
      } else {
        dto.accountId = null;
      }

      const result = await this.repo.findOne({
        where: {
          organizationDetailId,
          name: dto.name,
          studentNo: dto.studentNo,
          accountId: dto.accountId,
        },
      });
      if (!result) {
        const obj = Object.create(dto);
        this.repo.save(obj);
        return "New";
      }
      return "Old";
    } catch (error) {
      return "Old";
    }
  }

  async create(dto: CreateStudentDto) {
    const user = await this.accountRepo.findOne({
      where: { phoneNumber: dto.contactNo },
    });
    if (!user) {
      const accObj = Object.create({
        phoneNumber: dto.contactNo,
        roles: UserRole.STUDENT,
      });
      const user = await this.accountRepo.save(accObj);
      dto.accountId = user.id;
    }
    // dto.accountId = user.id;
    const result = await this.repo.findOne({
      where: {
        name: dto.name,
        organizationDetailId: dto.organizationDetailId,
        studentNo: dto.studentNo,
      },
    });
    if (result) {
      throw new ConflictException("Student Details already exist !");
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAllForExcel() {
    const result = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.address",
        "student.city",
        "student.card",
        "student.UID",
        "student.PEN",
        "student.state",
        "student.gender",
        "student.dob",
        "student.photoNumber",
        "student.srNo",
        "student.dob",
        "student.contactNo",
        "student.altContactNo",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.settingId",
        "student.createdAt",
        "student.organizationDetailId",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",
      ])
      .getMany();
    return result;
  }

  async findAll(
    organizationId: string,
    dto: CommonPaginationDto,
    type: string
  ) {
    const keyword = dto.keyword || "";
    const query = this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.studentAttendance", "studentAttendance")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.address",
        "student.city",
        "student.state",
        "student.gender",
        "student.photoNumber",
        "student.srNo",
        "student.UID",
        "student.PEN",
        "student.card",
        "student.dob",
        "student.contactNo",
        "student.altContactNo",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.profileName",
        "student.fatherName",
        "student.settingId",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "classList.id",
        "classList.priority",
        "classList.name",

        "classDiv.id",
        "classDiv.priority",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",
        "organizationDetail.name",

        "studentAttendance.id",
        "studentAttendance.status",
      ]);
    if (type === "o") {
      query.andWhere("student.organizationDetailId = :organizationDetailId", {
        organizationDetailId: organizationId,
        settingId: organizationId,
      });
    } else {
      query.andWhere(" student.settingId = :settingId", {
        settingId: organizationId,
      });
    }
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({
        "classList.priority": "ASC",
        "classDiv.priority": "ASC",
        "student.srNo": "ASC",
      })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllByDashboard(dto: PaginationDtoWithDate, all: string) {
    const keyword = dto.keyword || "";
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);
    const query = this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "oAccount")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.address",
        "student.city",
        "student.state",
        "student.gender",
        "student.photoNumber",
        "student.srNo",
        "student.UID",
        "student.PEN",
        "student.card",
        "student.dob",
        "student.contactNo",
        "student.altContactNo",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.profileName",
        "student.fatherName",
        "student.settingId",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",
        "organizationDetail.name",
        "oAccount.roles",
      ])
      .where("account.status = :astatus", { astatus: DefaultStatus.ACTIVE });
    if (all === "No") {
      query.andWhere(
        "student.createdAt >= :fromDate AND student.createdAt <= :toDate",
        {
          fromDate: fromDate,
          toDate: toDate,
        }
      );
    }
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "student.createdAt": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findWholeStudent(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.address",
        "student.city",
        "student.state",
        "student.card",
        "student.gender",
        "student.photoNumber",
        "student.srNo",
        "student.dob",
        "student.contactNo",
        "student.altContactNo",
        "student.UID",
        "student.PEN",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.settingId",
        "student.createdAt",
        "student.organizationDetailId",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",

        "organizationDetail.name",
      ])
      .where("student.status = :status", { status: DefaultStatus.ACTIVE })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "student.srNo": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllByClass(
    organizationId: string,
    classId: string,
    dto: CommonPaginationDto
  ) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.card",
        "student.rollNo",
        "student.photoNumber",
        "student.settingId",
        "student.srNo",
        "student.address",
        "student.city",
        "student.contactNo",
        "student.altContactNo",
        "student.state",
        "student.gender",
        "student.dob",
        "student.accountId",
        "student.status",
        "student.UID",
        "student.PEN",
        "student.profile",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "account.id",
        "account.phoneNumber",
        "account.status",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.image",
      ])
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId = :classId",
        {
          organizationDetailId: organizationId,
          classId: classId,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "student.srNo": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async generateCard(organizationId: string, classId: string) {
    const classes = JSON.parse(classId);
    const result = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.regNo as student_regNo",
        "student.name as student_name",
        "student.emailId as student_emailId",
        "student.rollNo as student_rollNo",
        "student.rfidNo as student_rfidNo",
        "student.photoNumber as student_photoNumber",
        "student.aadharNumber as student_aadharNumber",
        "student.srNo as student_srNo",
        "student.bloodGroup as student_bloodGroup",
        "student.address as student_address",
        "student.city as student_city",
        "student.contactNo as student_contactNo",
        "student.fatherContactNo as student_fatherContactNo",
        "student.motherContactNo as student_motherContactNo",
        "student.guardianContactNo as student_guardianContactNo",
        "student.guardianRelation as student_guardianRelation",
        "student.state as student_state",
        "student.gender as student_gender",
        "student.dob as student_dob",
        "student.UID as student_UID",
        "student.PEN as student_PEN",
        "student.profile as student_profile",
        "student.fatherImage as student_fatherImage",
        "student.motherImage as student_motherImage",
        "student.guardianImage as student_guardianImage",
        "student.fatherName as student_fatherName",
        "student.motherName as student_motherName",
        "student.guardianName as student_guardianName",
        "classList.name as classList_name",
        "classList.card as classList_card",
        "classList.card as classList_pCard",
        "classDiv.name as classDiv_name",
        "houseZone.name as houseZone_name",
        "houseZone.card as houseZone_card",
        "organizationDetail.name as organizationDetail_name",
        "organizationDetail.address as organizationDetail_address",
        "organizationDetail.image as organizationDetail_image",
        "organizationDetail.contactNo as organizationDetail_contactNo",
      ])
      .where(
        "  student.organizationDetailId = :organizationDetailId AND student.classListId IN (:...classId) AND student.card = :card",
        {
          organizationDetailId: organizationId,
          classId: classes ? classes : [],
          card: 1,
        }
      )
      .orderBy({
        "classList.priority": "ASC",
        "classDiv.priority": "ASC",
        "student.srNo": "ASC",
      })
      // .limit(60)
      .getRawMany();
    return { result };
  }

  async generateProfile(id: string) {
    const result = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.regNo as student_regNo",
        "student.name as student_name",
        "student.emailId as student_emailId",
        "student.rollNo as student_rollNo",
        "student.rfidNo as student_rfidNo",
        "student.photoNumber as student_photoNumber",
        "student.aadharNumber as student_aadharNumber",
        "student.srNo as student_srNo",
        "student.bloodGroup as student_bloodGroup",
        "student.address as student_address",
        "student.city as student_city",
        "student.contactNo as student_contactNo",
        "student.fatherContactNo as student_fatherContactNo",
        "student.motherContactNo as student_motherContactNo",
        "student.guardianContactNo as student_guardianContactNo",
        "student.guardianRelation as student_guardianRelation",
        "student.state as student_state",
        "student.gender as student_gender",
        "student.dob as student_dob",
        "student.UID as student_UID",
        "student.PEN as student_PEN",
        "student.profile as student_profile",
        "student.fatherImage as student_fatherImage",
        "student.motherImage as student_motherImage",
        "student.guardianImage as student_guardianImage",
        "student.fatherName as student_fatherName",
        "student.motherName as student_motherName",
        "student.guardianName as student_guardianName",
        "classList.name as classList_name",
        "classList.card as classList_card",
        "classList.card as classList_pCard",
        "classDiv.name as classDiv_name",
        "houseZone.name as houseZone_name",
        "houseZone.card as houseZone_card",
        "organizationDetail.name as organizationDetail_name",
        "organizationDetail.address as organizationDetail_address",
        "organizationDetail.image as organizationDetail_image",
        "organizationDetail.contactNo as organizationDetail_contactNo",
      ])
      .where("  student.id = :id", {
        id,
      })
      // .limit(60)
      .getRawMany();
    return { result };
  }

  async generateCorrectionCard(
    organizationId: string,
    classId: string,
    card: any
  ) {
    const classes = JSON.parse(classId);
    const [result, total] = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.photoNumber",
        "student.settingId",
        "student.card",
        "student.srNo",
        "student.address",
        "student.city",
        "student.contactNo",
        "student.altContactNo",
        "student.fatherContactNo",
        "student.motherContactNo",
        "student.state",
        "student.gender",
        "student.dob",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.UID",
        "student.PEN",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "account.id",
        "account.phoneNumber",
        "account.status",

        "classList.id",
        "classList.name",
        "classList.priority",

        "classDiv.id",
        "classDiv.name",
        "classDiv.priority",

        "houseZone.id",
        "houseZone.name",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.image",
      ])
      .where(
        "  student.organizationDetailId = :organizationDetailId AND student.classListId IN (:...classId) AND student.card = :card",
        {
          organizationDetailId: organizationId,
          classId: classes ? classes : [],
          card: card,
        }
      )
      .orderBy({
        "classList.priority": "ASC",
        "classDiv.priority": "ASC",
        "student.srNo": "ASC",
      })
      // .limit(60)
      .getManyAndCount();
    return { result, total };
  }

  async findAllByClassList(
    organizationId: string,
    classId: string,
    dto: CommonPaginationDto
  ) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("student")
      .select(["student.id", "student.name"])
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId = :classId",
        {
          organizationDetailId: organizationId,
          classId: classId,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("student.name LIKE :name", { name: "%" + keyword + "%" });
        })
      )
      .orderBy({ "student.srNo": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllByClassDiv(
    organizationId: string,
    classId: string,
    divId: string,
    dto: CommonPaginationDto
  ) {
    const keyword = dto.keyword || "";
    const query = this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.cardStudent", "cardStudent")
      .leftJoinAndSelect("cardStudent.cardOrder", "cardOrder")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.photoNumber",
        "student.settingId",
        "student.card",
        "student.bloodGroup",
        "student.rfidNo",
        "student.aadharNumber",
        "student.srNo",
        "student.address",
        "student.city",
        "student.contactNo",
        "student.altContactNo",
        "student.state",
        "student.gender",
        "student.dob",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.UID",
        "student.PEN",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "account.id",
        "account.phoneNumber",
        "account.status",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.image",

        "cardStudent.id",
        "cardOrder.status",
      ])
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId = :classId",
        {
          organizationDetailId: organizationId,
          classId: classId,
        }
      );
    if (divId && divId.length > 20) {
      query.andWhere("student.classDivId = :divId", {
        divId: divId,
      });
    }
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({
        "classList.priority": "ASC",
        "classDiv.priority": "ASC",
        "student.srNo": "ASC",
      })
      // .take(dto.limit)
      // .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async myChilds(accountId: string) {
    const [result, total] = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.cardStudent", "cardStudent")
      .leftJoinAndSelect("cardStudent.cardOrder", "cardOrder")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.photoNumber",
        "student.settingId",
        "student.card",
        "student.bloodGroup",
        "student.rfidNo",
        "student.aadharNumber",
        "student.srNo",
        "student.address",
        "student.city",
        "student.contactNo",
        "student.altContactNo",
        "student.state",
        "student.gender",
        "student.dob",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.UID",
        "student.PEN",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "account.id",
        "account.phoneNumber",
        "account.status",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.image",

        "cardStudent.id",
        "cardOrder.status",
      ])
      .where("student.accountId = :accountId", {
        accountId: accountId,
      })
      .getManyAndCount();
    return { result, total };
  }

  async findAllByClassDivWithAttendance(
    organizationId: string,
    classId: string,
    divId: string,
    date: string,
    dto: CommonPaginationDto
  ) {
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(date);
    toDate.setHours(23, 59, 59, 59);
    const keyword = dto.keyword || "";
    const query = this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect(
        "student.studentAttendance",
        "studentAttendance",
        "studentAttendance.date >= :fromDate AND studentAttendance.date <= :toDate",
        { fromDate, toDate }
      )
      .leftJoinAndSelect("student.cardStudent", "cardStudent")
      .leftJoinAndSelect("cardStudent.cardOrder", "cardOrder")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("student.houseZone", "houseZone")
      .leftJoinAndSelect("student.account", "account")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.photoNumber",
        "student.settingId",
        "student.card",
        "student.srNo",
        "student.address",
        "student.city",
        "student.contactNo",
        "student.altContactNo",
        "student.state",
        "student.gender",
        "student.dob",
        "student.accountId",
        "student.status",
        "student.profile",
        "student.UID",
        "student.PEN",
        "student.profileName",
        "student.fatherName",
        "student.motherName",
        "student.createdAt",
        "student.organizationDetailId",

        "account.id",
        "account.phoneNumber",
        "account.status",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "houseZone.id",
        "houseZone.name",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.image",

        "cardStudent.id",
        "cardOrder.status",

        "studentAttendance.id",
        "studentAttendance.status",
      ])
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId = :classId",
        {
          organizationDetailId: organizationId,
          classId: classId,
        }
      );
    if (divId && divId.length > 20) {
      query.andWhere("student.classDivId = :divId", {
        divId: divId,
      });
    }
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({
        "classList.priority": "ASC",
        "classDiv.priority": "ASC",
        "student.srNo": "ASC",
      })
      // .take(dto.limit)
      // .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllByClassDivZone(
    organizationId: string,
    classId: string,
    divId: string,
    zoneId: string,
    dto: CommonPaginationDto
  ) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("student")
      .select([
        "student.id",
        "student.name",
        "student.emailId",
        "student.rollNo",
        "student.address",
        "student.city",
        "student.state",
        "student.gender",
        "student.photoNumber",
        "student.srNo",
        "student.dob",
        "student.card",
        "student.accountId",
        "student.status",
        "student.contactNo",
        "student.UID",
        "student.PEN",

        "student.altContactNo",
        "student.settingId",
        "student.createdAt",
        "student.organizationDetailId",
      ])
      .where(
        "student.organizationDetailId = :organizationDetailId AND student.classListId = :classId AND student.classDivId = :divId AND student.houseZoneId = :houseZoneId",
        {
          organizationDetailId: organizationId,
          classId: classId,
          divId: divId,
          houseZoneId: zoneId,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "student.name LIKE :name OR student.contactNo LIKE :contactNo OR student.altContactNo LIKE :altContactNo OR student.UID LIKE :UID OR student.PEN LIKE :PEN",
            {
              name: "%" + keyword + "%",
              contactNo: "%" + keyword + "%",
              altContactNo: "%" + keyword + "%",
              UID: "%" + keyword + "%",
              PEN: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "student.srNo": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async studentDetails(id: string) {
    const result = await this.repo
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("student.classDiv", "classDiv")
      .leftJoinAndSelect("classDiv.classListDiv", "classListDiv")
      .leftJoinAndSelect("classListDiv.staffDetail", "staffDetail")
      .leftJoinAndSelect("classListDiv.coOrdinator", "coOrdinator")
      .leftJoinAndSelect("student.classList", "classList")
      .leftJoinAndSelect("student.houseZone", "houseZone")
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
        "student.profileName",
        "student.fatherImage",
        "student.fatherImageName",
        "student.motherImage",
        "student.motherImageName",
        "student.guardianImage",
        "student.guardianImageName",
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
        "student.transport",
        "student.stream",
        "student.canteen",
        "student.library",
        "student.hostel",
        "student.card",
        "student.status",
        "student.createdAt",
        "student.updatedAt",
        "student.accountId",
        "student.updatedId",
        "student.settingId",
        "student.classListId",
        "student.classDivId",
        "student.houseZoneId",

        "organizationDetail.id",
        "organizationDetail.name",

        "classList.id",
        "classList.name",

        "classDiv.id",
        "classDiv.name",

        "classListDiv.id",

        "staffDetail.id",
        "staffDetail.name",

        "coOrdinator.id",
        "coOrdinator.name",

        "houseZone.id",
        "houseZone.name",
      ])
      .where("student.id = :id", { id })
      .getOne();
    if (!result) {
      throw new NotFoundException("Details not Found!");
    }
    return result;
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({
      relations: ["classDiv", "classList", "houseZone"],
      where: { id: id },
    });
    if (!result) {
      throw new NotFoundException("Details not Found!");
    }
    return result;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Student not Found !");
    }
    delete result.classList;
    delete result.classDiv;
    delete result.houseZone;
    const object = Object.assign(result, updateStudentDto);
    return this.repo.save(object);
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Student not Found !");
    }
    delete result.classList;
    delete result.classDiv;
    delete result.houseZone;
    if (status.status === DefaultStatus.DEACTIVE) {
      const acount = await this.accountRepo.findOne({
        where: { id: result.accountId },
      });
      await this.accountRepo.remove(acount);
      return this.repo.remove(result);
    }
    const object = Object.assign(result, status);
    return this.repo.save(object);
  }

  async card(dto: StudentCardDto[]) {
    return this.repo.save(dto);
  }

  async promoteClass(dto: PromoteClassDto[]) {
    return this.repo.save(dto);
  }

  async image(image: string, result: Student, photoNumber: string) {
    const obj = Object.assign(result, {
      profile: process.env.HOC_CDN_LINK + image,
      profileName: image,
      photoNumber,
    });
    return this.repo.save(obj);
  }

  async fatherImage(image: string, result: Student, fphotoNumber: string) {
    const obj = Object.assign(result, {
      fatherImage: process.env.HOC_CDN_LINK + image,
      fatherImageName: image,
      fphotoNumber,
    });
    return this.repo.save(obj);
  }

  async motherImage(image: string, result: Student, mphotoNumber: string) {
    const obj = Object.assign(result, {
      motherImage: process.env.HOC_CDN_LINK + image,
      motherImageName: image,
      mphotoNumber,
    });
    return this.repo.save(obj);
  }

  async guardianImage(image: string, result: Student, gphotoNumber: string) {
    const obj = Object.assign(result, {
      guardianImage: process.env.HOC_CDN_LINK + image,
      guardianImageName: image,
      gphotoNumber,
    });
    return this.repo.save(obj);
  }

  async findClass(settingId: string) {
    return this.classListRepo.find({
      select: ["id", "name"],
      where: { settingId, status: DefaultStatus.ACTIVE },
    });
  }

  async findSection(settingId: string) {
    return this.classDivRepo.find({
      select: ["id", "name"],
      where: { settingId, status: DefaultStatus.ACTIVE },
    });
  }

  async findHouseZone(settingId: string) {
    return this.houseZoneRepo.find({
      select: ["id", "name"],
      where: { settingId, status: DefaultStatus.ACTIVE },
    });
  }
}
