import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { ClassListService } from "../class-list/class-list.service";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "../common/dto/pagination-with-default-status.dto";
import { Designation } from "../designation/entities/designation.entity";
import { DefaultStatus, UserRole } from "../enum";
import { Menu } from "../menus/entities/menu.entity";
import { MenusService } from "../menus/menus.service";
import { PaginationDtoWithDate } from "../organization-details/dto/pagination.dto";
import { PermissionsService } from "../permissions/permissions.service";
import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { Brackets, Repository } from "typeorm";
import { Account } from "../account/entities/account.entity";
import {
  CreateStaffDetailDto,
  UpdateStaffDetailDto,
} from "./dto/staff-detail.dto";
import { StaffDetail } from "./entities/staff-detail.entity";

@Injectable()
export class StaffDetailsService {
  constructor(
    @InjectRepository(StaffDetail)
    private readonly repo: Repository<StaffDetail>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly menuService: MenusService,
    private readonly permissionService: PermissionsService,
    private readonly userPermService: UserPermissionsService,
    private readonly classListServiceService: ClassListService
  ) {}

  async createCSV(dto: any, organizationDetailId: string, settingId: string) {
    if (dto.contactNo) {
      let user = await this.accountRepo.findOne({
        where: { phoneNumber: dto.contactNo, roles: UserRole.STAFF },
      });
      if (!user) {
        const accObj = Object.create({
          phoneNumber: dto.contactNo,
          roles: UserRole.STAFF,
          settingId,
          createdBy: dto.updatedId,
        });
        user = await this.accountRepo.save(accObj);
      }
      dto.accountId = user.id;
      this.createPermission(user.id);
    } else {
      dto.accountId = null;
    }

    const result = await this.repo.findOne({
      where: {
        organizationDetailId,
        settingId,
        name: dto.name,
        contactNo: dto.contactNo,
        accountId: dto.accountId,
      },
    });
    if (!result) {
      const obj = Object.create(dto);
      this.repo.save(obj);
      return "New";
    }
    return "Old";
  }

  async create(dto: CreateStaffDetailDto) {
    const user = await this.accountRepo.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPasword = await bcrypt.hash(dto.password, salt);
    if (user) {
      throw new ConflictException(
        "Phone number already exists with other account!"
      );
    } else {
      const accObj = Object.create({
        phoneNumber: dto.phoneNumber,
        roles: UserRole.STAFF,
        password: hashPasword,
        createdBy: dto.updatedId,
        settingId: dto.settingId,
      });
      const account = await this.accountRepo.save(accObj);
      dto.accountId = account.id;
      this.createPermission(account.id);
      const obj = Object.create(dto);
      const data = await this.repo.save(obj);
      data.accountId = account.id;
      return data;
    }
  }

  async createPermission(accountId: string) {
    const menus = await this.menuService.findAll();
    const perms = await this.permissionService.findAll();

    const obj = [];
    menus.forEach((menu) => {
      perms.forEach((perm) => {
        obj.push({
          accountId,
          menuId: menu.id,
          permissionId: perm.id,
        });
      });
    });
    this.userPermService.create(obj);
  }

  async update(accountId: string, dto: UpdateStaffDetailDto) {
    const user = await this.repo.findOne({
      where: { accountId: accountId },
    });
    if (!user) {
      throw new NotFoundException("Account not found!");
    }
    try {
      this.delStaffDetail(user.accountId);

      const obj = Object.assign(user, dto);
      return this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException(
        "Either duplicate email/pan number/aadhar number or invalid details!"
      );
    }
  }

  async generateFinalCard(organizationId: string, classId: string) {
    const classes = JSON.parse(classId);
    const result = await this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .select([
        "staffDetail.card as staffDetail_card",
        "staffDetail.employeeId as staffDetail_employeeId",
        "staffDetail.rfidNo as staffDetail_rfidNo",
        "staffDetail.name as staffDetail_name",
        "staffDetail.emailId as staffDetail_emailId",
        "staffDetail.aadharNumber as staffDetail_aadharNumber",
        "staffDetail.cast as staffDetail_cast",
        "staffDetail.photoNumber as staffDetail_photoNumber",
        "staffDetail.religion as staffDetail_religion",
        "staffDetail.nationality as staffDetail_nationality",
        "staffDetail.contactNo as staffDetail_contactNo",
        "staffDetail.altContactNo as staffDetail_altContactNo",
        "staffDetail.address as staffDetail_address",
        "staffDetail.city as staffDetail_city",
        "staffDetail.state as staffDetail_state",
        "staffDetail.pincode as staffDetail_pincode",
        "staffDetail.profile as staffDetail_profile",
        "staffDetail.profileName as staffDetail_profileName",
        "staffDetail.gender as staffDetail_gender",
        "staffDetail.dob as staffDetail_dob",
        "staffDetail.joiningDate as staffDetail_joiningDate",
        "designation.name as designation_name",
        "designation.card as designation_card",
        "organizationDetail.id as organizationDetail_id",
        "organizationDetail.name as organizationDetail_name",
        "organizationDetail.address as organizationDetail_address",
        "organizationDetail.image as organizationDetail_image",
      ])
      .where(
        "organizationDetail.id = :organizationDetailId AND designation.id IN (:...classId) AND staffDetail.card = :card",
        {
          organizationDetailId: organizationId,
          classId: classes ? classes : [],
          card: 1,
        }
      )
      .orderBy({
        "staffDetail.employeeId": "ASC",
      })
      // .limit(60)
      .getRawMany();
    return { result };
  }

  async generateProfile(id: string) {
    const result = await this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .select([
        "staffDetail.card as staffDetail_card",
        "staffDetail.employeeId as staffDetail_employeeId",
        "staffDetail.rfidNo as staffDetail_rfidNo",
        "staffDetail.name as staffDetail_name",
        "staffDetail.emailId as staffDetail_emailId",
        "staffDetail.aadharNumber as staffDetail_aadharNumber",
        "staffDetail.cast as staffDetail_cast",
        "staffDetail.photoNumber as staffDetail_photoNumber",
        "staffDetail.religion as staffDetail_religion",
        "staffDetail.nationality as staffDetail_nationality",
        "staffDetail.contactNo as staffDetail_contactNo",
        "staffDetail.altContactNo as staffDetail_altContactNo",
        "staffDetail.address as staffDetail_address",
        "staffDetail.city as staffDetail_city",
        "staffDetail.state as staffDetail_state",
        "staffDetail.pincode as staffDetail_pincode",
        "staffDetail.profile as staffDetail_profile",
        "staffDetail.profileName as staffDetail_profileName",
        "staffDetail.gender as staffDetail_gender",
        "staffDetail.dob as staffDetail_dob",
        "staffDetail.joiningDate as staffDetail_joiningDate",
        "designation.name as designation_name",
        "designation.card as designation_card",
        "organizationDetail.id as organizationDetail_id",
        "organizationDetail.name as organizationDetail_name",
        "organizationDetail.address as organizationDetail_address",
        "organizationDetail.image as organizationDetail_image",
      ])
      .where("staffDetail.id = :id", {
        id: id,
      })
      .getRawMany();
    return { result };
  }

  async findStaff(id: string, type: string, dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || "";
    const query = this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "accounts")
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.card",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.contactNo",
        "staffDetail.altContactNo",
        "staffDetail.profile",
        "staffDetail.gender",
        "staffDetail.dob",
        "staffDetail.joiningDate",
        "staffDetail.status",
        "staffDetail.accountId",

        "account.id",
        "account.phoneNumber",
        "account.roles",

        "designation.id",
        "designation.name",

        "organizationDetail.id",
        "organizationDetail.name",

        "accounts.roles",
      ])
      .where("staffDetail.status = :status", { status: dto.status });
    if (type === "ORGANIZATION") {
      query.andWhere(
        "staffDetail.organizationDetailId = :organizationDetailId",
        { organizationDetailId: id }
      );
    }
    if (type === "PARTNER") {
      query.andWhere("staffDetail.partnerDetailId = :partnerDetailId", {
        partnerDetailId: id,
      });
    }
    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "staffDetail.name LIKE :name OR staffDetail.emailId LIKE :emailId OR account.phoneNumber LIKE :phoneNumber",
            {
              name: "%" + keyword + "%",
              emailId: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "staffDetail.name": "ASC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async findAll(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "accounts")
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.card",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.contactNo",
        "staffDetail.altContactNo",
        "staffDetail.profile",
        "staffDetail.gender",
        "staffDetail.dob",
        "staffDetail.joiningDate",
        "staffDetail.status",
        "staffDetail.accountId",

        "account.id",
        "account.phoneNumber",
        "account.roles",

        "designation.id",
        "designation.name",

        "organizationDetail.id",
        "organizationDetail.name",

        "accounts.roles",
      ])
      .where("staffDetail.status = :status AND account.roles != :roles", {
        status: DefaultStatus.ACTIVE,
        roles: UserRole.ROOT,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "staffDetail.name LIKE :name OR staffDetail.emailId LIKE :emailId OR account.phoneNumber LIKE :phoneNumber",
            {
              name: "%" + keyword + "%",
              emailId: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "staffDetail.name": "ASC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async findMyStaff(id: string, dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "accounts")
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.card",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.contactNo",
        "staffDetail.altContactNo",
        "staffDetail.profile",
        "staffDetail.gender",
        "staffDetail.dob",
        "staffDetail.joiningDate",
        "staffDetail.status",
        "staffDetail.accountId",

        "account.id",
        "account.phoneNumber",
        "account.roles",

        "designation.id",
        "designation.name",

        "organizationDetail.id",
        "organizationDetail.name",

        "accounts.roles",
      ])
      .where(
        "staffDetail.status = :status AND account.createdBy = :createdBy AND account.roles = :roles",
        { status: dto.status, createdBy: id, roles: UserRole.STAFF }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "staffDetail.name LIKE :name OR staffDetail.emailId LIKE :emailId OR account.phoneNumber LIKE :phoneNumber",
            {
              name: "%" + keyword + "%",
              emailId: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "staffDetail.name": "ASC" })
      .skip(dto.offset)
      .take(dto.limit)
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
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "accounts")
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.card",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.contactNo",
        "staffDetail.altContactNo",
        "staffDetail.profile",
        "staffDetail.gender",
        "staffDetail.dob",
        "staffDetail.joiningDate",
        "staffDetail.status",
        "staffDetail.accountId",
        "staffDetail.createdAt",
        "staffDetail.settingId",

        "account.id",
        "account.phoneNumber",
        "account.roles",

        "designation.id",
        "designation.name",

        "organizationDetail.id",
        "organizationDetail.name",

        "accounts.roles",
      ])
      .where("account.status = :status AND account.roles NOT IN (:...roles)", {
        status: DefaultStatus.ACTIVE,
        roles: [UserRole.ROOT, UserRole.ADMIN],
      });
    if (all === "No") {
      query.andWhere(
        "staffDetail.createdAt >= :fromDate AND staffDetail.createdAt <= :toDate",
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
            "staffDetail.name LIKE :name OR staffDetail.emailId LIKE :emailId OR account.phoneNumber LIKE :phoneNumber",
            {
              name: "%" + keyword + "%",
              emailId: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "staffDetail.createdAt": "DESC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findMyStaffList(id: string, dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .select([
        "staffDetail.id",
        "staffDetail.name",
        // 'account.id',
      ])
      .where(
        "staffDetail.status = :status AND staffDetail.organizationDetailId = :organizationDetailId",
        { status: DefaultStatus.ACTIVE, organizationDetailId: id }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where("staffDetail.name LIKE :name", {
            name: "%" + keyword + "%",
          });
        })
      )
      .orderBy({ "staffDetail.name": "ASC" })
      .getManyAndCount();
    return { result, total };
  }

  async findOne(accountId: string) {
    const user = await this.repo.findOne({ where: { accountId } });
    if (!user) {
      throw new NotFoundException("User not found!");
    }
    return user;
  }

  profile(id: string) {
    return this.getStaffDetail(id);
  }

  async image(image: string, result: StaffDetail, photoNumber: string) {
    const obj = Object.assign(result, {
      profile: process.env.HOC_CDN_LINK + image,
      profileName: image,
      photoNumber,
    });
    this.delStaffDetail(result.accountId);
    return this.repo.save(obj);
  }

  delStaffDetail(id: string) {
    this.cacheManager.del("staffDetail" + id);
  }

  async status(accountId: string, dto: DefaultStatusDto) {
    const user = await this.repo.findOne({
      where: { accountId: accountId },
    });
    if (!user) {
      throw new NotFoundException("Account not found!");
    }
    try {
      this.delStaffDetail(user.accountId);
      const obj = Object.assign(user, dto);
      return this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException(
        "Either duplicate email/pan number/aadhar number or invalid details!"
      );
    }
  }

  private async getStaffDetail(id: string) {
    const user = await this.repo
      .createQueryBuilder("staffDetail")
      .leftJoinAndSelect("staffDetail.account", "account")
      .leftJoinAndSelect("staffDetail.organizationDetail", "organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "accounts")
      .leftJoinAndSelect("staffDetail.designation", "designation")
      .leftJoinAndSelect("staffDetail.staffDocument", "staffDocument")
      .leftJoinAndSelect("staffDetail.staffSubject", "staffSubject")
      .leftJoinAndSelect("staffSubject.subject", "subject")
      .leftJoinAndSelect("staffDetail.staffDepartment", "staffDepartment")
      .leftJoinAndSelect("staffDepartment.department", "department")
      .leftJoinAndSelect("staffDetail.classListDiv", "classListDiv")
      .leftJoinAndSelect("classListDiv.classList", "cclassList")
      .leftJoinAndSelect("classListDiv.classDiv", "cclassDiv")
      .leftJoinAndSelect("classListDiv.subject", "csubject")
      .leftJoinAndSelect(
        "staffDetail.coOrdinator",
        "coOrdinator"
        // "coOrdinator.coOrdinatorId = :coOrdinatorId",
        // { coOrdinatorId: id }
      )
      .leftJoinAndSelect("coOrdinator.classList", "coclassList")
      .leftJoinAndSelect("coOrdinator.classDiv", "coclassDiv")
      .select([
        "staffDetail.id",
        "staffDetail.employeeId",
        "staffDetail.rfidNo",
        "staffDetail.name",
        "staffDetail.card",
        "staffDetail.emailId",
        "staffDetail.aadharNumber",
        "staffDetail.cast",
        "staffDetail.photoNumber",
        "staffDetail.religion",
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
        "staffDetail.transport",
        "staffDetail.canteen",
        "staffDetail.library",
        "staffDetail.hostel",
        "staffDetail.status",
        "staffDetail.createdAt",
        "staffDetail.updatedAt",
        "staffDetail.accountId",
        "staffDetail.designationId",
        "staffDetail.updatedId",
        "staffDetail.organizationDetailId",
        "staffDetail.partnerDetailId",
        "staffDetail.settingId",

        "account.id",
        "account.phoneNumber",
        "account.roles",
        "account.status",

        "accounts.id",
        "accounts.phoneNumber",
        "accounts.roles",
        "accounts.status",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.settingId",
        "organizationDetail.accountId",

        "staffSubject.id",
        "subject.id",
        "subject.name",

        "staffDepartment.id",
        "department.id",
        "department.name",

        "designation.id",
        "designation.name",

        "staffDocument.id",
        "staffDocument.type",
        "staffDocument.documentId",
        "staffDocument.url",
        "staffDocument.name",

        "classListDiv.id",
        "classListDiv.staffDetailId",
        "classListDiv.classListId",
        "classListDiv.classDivId",
        "classListDiv.subjectId",
        "classListDiv.time_end",
        "classListDiv.time_start",
        "classListDiv.type",
        "cclassList.id",
        "cclassList.name",
        "cclassDiv.id",
        "cclassDiv.name",
        "csubject.id",
        "csubject.name",

        "coOrdinator.id",
        "coOrdinator.coOrdinatorId",
        "coOrdinator.classListId",
        "coOrdinator.classDivId",
        "coclassList.id",
        "coclassList.name",
        "coclassDiv.id",
        "coclassDiv.name",
      ])
      .where("staffDetail.accountId = :accountId", {
        accountId: id,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException("Account details not found!");
    }
    user.coOrdinator = await this.classListServiceService.findCoOrdinatorClass(
      user.id
    );
    const perms = await this.menuRepo
      .createQueryBuilder("menu")
      .leftJoinAndSelect("menu.userPermission", "userPermission")
      .leftJoinAndSelect("userPermission.permission", "permission")
      .where("userPermission.accountId = :accountId", { accountId: id })
      .orderBy({ "menu.title": "ASC", "permission.id": "ASC" })
      .getMany();

    return { user, perms };
  }

  async findDesignation(settingId: string) {
    return this.designationRepo.find({
      select: ["id", "name"],
      where: { settingId },
    });
  }
}
