import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Account } from "../account/entities/account.entity";
import { MenusService } from "../menus/menus.service";
import { PermissionsService } from "../permissions/permissions.service";
import { UserPermissionsService } from "../user-permissions/user-permissions.service";
import { Brackets, Repository } from "typeorm";
import {
  CreateBranchDto,
  CreateOrganizationDetailDto,
  UpdateOrganizationDetailDto,
} from "./dto/organization-detail.dto";

import { BookCategory } from "../book-category/entities/book-category.entity";
import { ClassDiv } from "../class-div/entities/class-div.entity";
import { ClassList } from "../class-list/entities/class-list.entity";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { DefaultSetting } from "../default-settings/entities/default-setting.entity";
import { Department } from "../departments/entities/department.entity";
import { Designation } from "../designation/entities/designation.entity";
import {
  BranchType,
  DefaultSettingType,
  DefaultStatus,
  EventFor,
  SMType,
  UserRole,
} from "../enum";
import { HouseZone } from "../house-zones/entities/house-zone.entity";
import { Menu } from "../menus/entities/menu.entity";
import { Setting } from "../settings/entities/setting.entity";
import { Subject } from "../subjects/entities/subject.entity";
import { PaginationDto, PaginationDtoWithDate } from "./dto/pagination.dto";
import { OrganizationDetail } from "./entities/organization-detail.entity";
@Injectable()
export class OrganizationDetailsService {
  constructor(
    @InjectRepository(OrganizationDetail)
    private readonly repo: Repository<OrganizationDetail>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    private readonly menuService: MenusService,
    private readonly permissionService: PermissionsService,
    private readonly userPermService: UserPermissionsService,
    @InjectRepository(DefaultSetting)
    private readonly defaultSettingRepo: Repository<DefaultSetting>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,
    @InjectRepository(BookCategory)
    private readonly bookCategoryRepo: Repository<BookCategory>,
    @InjectRepository(ClassDiv)
    private readonly classDivRepo: Repository<ClassDiv>,
    @InjectRepository(ClassList)
    private readonly classListRepo: Repository<ClassList>,
    @InjectRepository(HouseZone)
    private readonly houseZoneRepo: Repository<HouseZone>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>
  ) {}

  async createDefaultSetting(settingId: string, roles: any) {
    const result: DefaultSetting[] = await this.defaultSettingRepo.find({
      where: { for: roles },
    });
    const departments = [];
    const designations = [];
    const classLists = [];
    const classDivs = [];
    const bookCategorys = [];
    const houseZones = [];
    const subjects = [];

    result.forEach((element) => {
      if (element.type === DefaultSettingType.DEPARTMENT) {
        departments.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
      if (element.type === DefaultSettingType.DESIGNATION) {
        designations.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
      if (element.type === DefaultSettingType.CLASS) {
        classLists.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
      if (element.type === DefaultSettingType.DIVISION) {
        classDivs.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
      if (element.type === DefaultSettingType.BOOK_CATEGORY) {
        bookCategorys.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
      if (element.type === DefaultSettingType.SUBJECT) {
        subjects.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
      if (element.type === DefaultSettingType.HOUSE_ZONE) {
        houseZones.push({
          name: element.name,
          priority: element.priority,
          settingId,
        });
      }
    });

    this.departmentRepo.save(departments);
    this.designationRepo.save(designations);
    this.classListRepo.save(classLists);
    this.classDivRepo.save(classDivs);
    this.bookCategoryRepo.save(bookCategorys);
    this.houseZoneRepo.save(houseZones);
    this.subjectRepo.save(subjects);
  }

  async createBranch(dto: CreateBranchDto) {
    const user = await this.accountRepo.findOne({
      where: {
        phoneNumber: dto.contactNo,
        roles: dto.roles,
      },
    });
    if (user) {
      throw new ConflictException("Phone number exists with other account!");
    }
    const creator = await this.accountRepo.findOne({
      where: {
        id: dto.updatedId,
      },
    });
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash("AA12345", salt);
    const setting = await this.settingRepo.save({
      type: SMType.SINGLE,
    });
    const accObj = Object.create({
      phoneNumber: dto.contactNo,
      roles: dto.roles,
      password: hashPassword,
      createdBy: creator.createdBy,
      settingId: setting.id,
    });
    const account = await this.accountRepo.save(accObj);
    this.createPermission(account.id);
    this.createDefaultSetting(setting.id, dto.roles);
    dto.settingId = setting.id;
    dto.accountId = account.id;

    const result = await this.repo.findOne({
      where: {
        accountId: dto.accountId,
        type: BranchType.BRANCH,
        address: dto.address,
        settingId: dto.settingId,
      },
    });
    if (result) {
      throw new ConflictException("Branch already exists!");
    } else {
      const obj = Object.assign(dto);
      return this.repo.save(obj);
    }
  }

  async createMain(dto: CreateOrganizationDetailDto) {
    const user = await this.accountRepo.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
        roles: dto.roles,
        createdBy: dto.updatedId,
      },
    });

    if (user) {
      throw new ConflictException(
        "Phone number already exists with other account!"
      );
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(dto.password, salt);
      const setting = await this.settingRepo.save({
        type: dto.singleMultiType,
      });
      dto.settingId = setting.id;
      const accObj = Object.create({
        phoneNumber: dto.phoneNumber,
        roles: dto.roles,
        password: hashPassword,
        createdBy: dto.updatedId,
        settingId: setting.id,
      });
      const account = await this.accountRepo.save(accObj);
      this.createPermission(account.id);
      this.createDefaultSetting(setting.id, dto.roles);
      dto.accountId = account.id;
      const obj = Object.assign(dto);
      return this.repo.save(obj);
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

  async findBranches(organizationId: string, dto: PaginationDto) {
    console.log({ organizationId, dto });
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .leftJoinAndSelect("organizationDetail.setting", "setting")
      .select([
        "setting.type",
        "organizationDetail.id",
        "organizationDetail.accountId",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.city",
        "organizationDetail.pincode",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.whatsApp",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.ownerEmail",
        "organizationDetail.ownerMobile",
        "organizationDetail.ownerWhatsApp",
        "organizationDetail.type",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.settingId",
      ])
      .where(
        "organizationDetail.organizationId = :organizationId AND account.roles = :roles AND organizationDetail.status = :status AND organizationDetail.type = :type",
        {
          organizationId: organizationId,
          roles: dto.roles,
          status: dto.status,
          type: BranchType.BRANCH,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "organizationDetail.name": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllByCreator(accountId: string, dto: PaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .leftJoinAndSelect("organizationDetail.setting", "setting")
      .select([
        "setting.type",
        "organizationDetail.id",
        "organizationDetail.accountId",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.city",
        "organizationDetail.pincode",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.whatsApp",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.ownerEmail",
        "organizationDetail.ownerMobile",
        "organizationDetail.ownerWhatsApp",
        "organizationDetail.type",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.settingId",
      ])
      .where(
        "account.createdBy = :createdBy AND account.roles = :roles AND organizationDetail.status = :status",
        {
          createdBy: accountId,
          roles: dto.roles,
          status: dto.status,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "organizationDetail.name": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllMySchool(accountId: string, dto: PaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .leftJoinAndSelect("organizationDetail.setting", "setting")
      .select([
        "setting.type",
        "organizationDetail.id",
        "organizationDetail.accountId",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.city",
        "organizationDetail.pincode",
        "organizationDetail.contactNo",
        "organizationDetail.image",
        "organizationDetail.whatsApp",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.ownerEmail",
        "organizationDetail.ownerMobile",
        "organizationDetail.ownerWhatsApp",
        "organizationDetail.type",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.settingId",
      ])
      .where(
        "organizationDetail.accountId = :accountId AND organizationDetail.status = :status AND account.roles = :roles ",
        {
          accountId: accountId,
          roles: dto.roles,
          status: dto.status,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "organizationDetail.name": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .leftJoinAndSelect("organizationDetail.updated", "updated")
      .leftJoinAndSelect("updated.staffDetail", "staffDetail")
      .leftJoinAndSelect("organizationDetail.setting", "setting")
      .leftJoinAndSelect("updated.partnerDetail", "partnerDetail")
      .select([
        "updated.id",
        "staffDetail.id",
        "staffDetail.name",
        "partnerDetail.id",
        "partnerDetail.firmName",

        "setting.type",
        "organizationDetail.id",
        "organizationDetail.accountId",
        "organizationDetail.name",
        "organizationDetail.image",
        "organizationDetail.whatsApp",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.contactNo",
        "organizationDetail.address",
        "organizationDetail.ownerEmail",
        "organizationDetail.type",
        "organizationDetail.state",
        "organizationDetail.city",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.settingId",
      ])
      .where(
        "account.roles = :roles AND organizationDetail.type = :type AND organizationDetail.status = :status",
        {
          roles: dto.roles,
          type: BranchType.MAIN,
          status: dto.status,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "organizationDetail.name": "ASC" })
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
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .leftJoinAndSelect("organizationDetail.updated", "updated")
      .leftJoinAndSelect("updated.staffDetail", "staffDetail")
      .leftJoinAndSelect("updated.partnerDetail", "partnerDetail")
      .leftJoinAndSelect("organizationDetail.setting", "setting")
      .select([
        "updated.id",
        "staffDetail.id",
        "staffDetail.name",
        "partnerDetail.id",
        "partnerDetail.firmName",

        "setting.type",
        "organizationDetail.id",
        "organizationDetail.accountId",
        "organizationDetail.name",
        "organizationDetail.image",
        "organizationDetail.whatsApp",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.contactNo",
        "organizationDetail.address",
        "organizationDetail.ownerEmail",
        "organizationDetail.type",
        "organizationDetail.state",
        "organizationDetail.city",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.settingId",

        "account.id",
        "account.createdAt",
        "account.phoneNumber",
      ])
      .andWhere(
        "account.status= :accountStatus AND account.roles = :roles AND organizationDetail.type = :type",
        {
          accountStatus: DefaultStatus.ACTIVE,
          roles: dto.roles,
          type: BranchType.MAIN,
          // status: DefaultStatus.ACTIVE,
        }
      );
    if (all === "No") {
      query.andWhere(
        "account.createdAt >= :fromDate AND account.createdAt <= :toDate",
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
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "account.createdAt": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findListByCreator(
    roles: UserRole,
    dto: CommonPaginationDto,
    accountId: string
  ) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select([
        "account.id",
        "account.roles",
        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.ownerName",
      ])
      .where(
        "account.createdBy = :createdBy AND account.roles = :roles AND organizationDetail.status = :status",
        {
          createdBy: accountId,
          roles: roles,
          status: DefaultStatus.ACTIVE,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "organizationDetail.name": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findList(roles: UserRole, dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select([
        "account.id",
        "account.roles",
        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.ownerName",
      ])
      .where("account.roles = :roles AND organizationDetail.status = :status", {
        roles: roles,
        status: DefaultStatus.ACTIVE,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "organizationDetail.contactNo LIKE :contactNo OR account.phoneNumber LIKE :phoneNumber OR organizationDetail.name LIKE :oname OR organizationDetail.city LIKE :city OR organizationDetail.ownerName LIKE :ownerName",
            {
              contactNo: "%" + keyword + "%",
              phoneNumber: "%" + keyword + "%",
              oname: "%" + keyword + "%",
              city: "%" + keyword + "%",
              ownerName: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "organizationDetail.name": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findListAll(roles: EventFor) {
    return this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .select(["organizationDetail.id"])
      .where("account.roles = :roles AND organizationDetail.status = :status", {
        roles: roles,
        status: DefaultStatus.ACTIVE,
      })
      .getMany();
  }

  async findAccount(id) {
    return this.repo
      .createQueryBuilder("organizationDetail")
      .select(["organizationDetail.accountId"])
      .where("organizationDetail.id = :id", {
        id: id,
      })
      .getOne();
  }

  async profile(accountId: string) {
    const result = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.account", "account")
      .where(
        "organizationDetail.accountId = :accountId AND organizationDetail.type = :type",
        {
          accountId: accountId,
          type: BranchType.MAIN,
        }
      )
      .getOne();
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    const perms = await this.menuRepo
      .createQueryBuilder("menu")
      .leftJoinAndSelect("menu.userPermission", "userPermission")
      .leftJoinAndSelect("userPermission.permission", "permission")
      .where("userPermission.accountId = :accountId", {
        accountId: result.accountId,
      })
      .orderBy({ "menu.title": "ASC", "permission.id": "ASC" })
      .getMany();
    return { result, perms };
  }

  async profileById(id: string) {
    const result = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.updated", "updated")
      .leftJoinAndSelect("updated.staffDetail", "staffDetail")
      .leftJoinAndSelect("updated.partnerDetail", "partnerDetail")
      .select([
        "updated.id",
        "staffDetail.id",
        "staffDetail.name",
        "partnerDetail.id",
        "partnerDetail.firmName",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.city",
        "organizationDetail.state",
        "organizationDetail.pincode",
        "organizationDetail.contactNo",
        "organizationDetail.website",
        "organizationDetail.image",
        "organizationDetail.imageName",
        "organizationDetail.whatsApp",
        "organizationDetail.numberOfBranch",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.ownerEmail",
        "organizationDetail.ownerMobile",
        "organizationDetail.ownerWhatsApp",
        "organizationDetail.type",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.updatedAt",
        "organizationDetail.accountId",
        "organizationDetail.updatedId",
        "organizationDetail.settingId",
        "organizationDetail.organizationId",
      ])
      .where("organizationDetail.id = :id", { id })
      .getOne();
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    const perms = await this.menuRepo
      .createQueryBuilder("menu")
      .leftJoinAndSelect("menu.userPermission", "userPermission")
      .leftJoinAndSelect("userPermission.permission", "permission")
      .where("userPermission.accountId = :accountId", {
        accountId: result.accountId,
      })
      .orderBy({ "menu.title": "ASC", "permission.id": "ASC" })
      .getMany();
    return { result, perms };
  }

  async findOne(id: string) {
    const result = await this.repo
      .createQueryBuilder("organizationDetail")
      .leftJoinAndSelect("organizationDetail.updated", "updated")
      .leftJoinAndSelect("updated.staffDetail", "staffDetail")
      .leftJoinAndSelect("updated.partnerDetail", "partnerDetail")
      .select([
        "updated.id",
        "staffDetail.id",
        "staffDetail.name",
        "partnerDetail.id",
        "partnerDetail.firmName",

        "organizationDetail.id",
        "organizationDetail.name",
        "organizationDetail.address",
        "organizationDetail.city",
        "organizationDetail.state",
        "organizationDetail.pincode",
        "organizationDetail.contactNo",
        "organizationDetail.website",
        "organizationDetail.image",
        "organizationDetail.imageName",
        "organizationDetail.whatsApp",
        "organizationDetail.numberOfBranch",
        "organizationDetail.email",
        "organizationDetail.ownerName",
        "organizationDetail.ownerEmail",
        "organizationDetail.ownerMobile",
        "organizationDetail.ownerWhatsApp",
        "organizationDetail.type",
        "organizationDetail.status",
        "organizationDetail.createdAt",
        "organizationDetail.updatedAt",
        "organizationDetail.accountId",
        "organizationDetail.updatedId",
        "organizationDetail.settingId",
        "organizationDetail.organizationId",
      ])
      .where("organizationDetail.id = :id", { id })
      .getOne();
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    return result;
  }

  async update(id: string, dto: UpdateOrganizationDetailDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    if (dto.numberOfBranch > 1) {
      this.settingRepo
        .createQueryBuilder()
        .update()
        .set({
          type: SMType.MULTI,
        })
        .where("id = :id", { id: result.settingId })
        .execute();
    }
    const object = Object.assign(result, dto);
    return this.repo.save(object);
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    if (status.status === DefaultStatus.DEACTIVE) {
      const account = await this.accountRepo.findOne({
        where: { id: result.accountId },
      });
      return this.accountRepo.remove(account);
    }
    const object = Object.assign(result, status);
    return this.repo.save(object);
  }

  async image(image: string, result: OrganizationDetail) {
    const obj = Object.assign(result, {
      image: process.env.HOC_CDN_LINK + image,
      imageName: image,
    });
    return this.repo.save(obj);
  }
}
