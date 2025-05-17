import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { Account } from "src/account/entities/account.entity";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus, EventFor, UserRole } from "src/enum";
import { Menu } from "src/menus/entities/menu.entity";
import { MenusService } from "src/menus/menus.service";
import { PermissionsService } from "src/permissions/permissions.service";
import { Setting } from "src/settings/entities/setting.entity";
import { UserPermissionsService } from "src/user-permissions/user-permissions.service";
import { Brackets, Repository } from "typeorm";
import { PaginationDto, PaginationDtoWithDate } from "./dto/pagination.dto";
import { PartnerDetailDto } from "./dto/partner-detail.dto";
import { PartnerDetail } from "./entities/partner-detail.entity";

@Injectable()
export class PartnerDetailsService {
  constructor(
    @InjectRepository(PartnerDetail)
    private readonly repo: Repository<PartnerDetail>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    private readonly menuService: MenusService,
    private readonly permissionService: PermissionsService,
    private readonly userPermService: UserPermissionsService
  ) {}

  async createMain(dto: PartnerDetailDto) {
    const user = await this.accountRepo.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
        roles: dto.roles,
        createdBy: dto.accountId,
      },
    });

    if (user) {
      throw new ConflictException(
        "Phone number already exists with other account!"
      );
    } else {
      const setting = await this.settingRepo.save({
        type: dto.singleMultiType,
      });
      dto.settingId = setting.id;
      if(dto.password) dto.password = await bcrypt.hash(dto.password, 13);
      const accObj = Object.create({
        phoneNumber: dto.phoneNumber,
        roles: dto.roles,
        createdBy: dto.accountId,
        settingId: dto.settingId,
        password: dto.password
      });
      const account = await this.accountRepo.save(accObj);
      dto.accountId = account.id;
      this.createPermission(account.id);
      const obj = Object.assign(dto);
      return this.repo.save(obj);
    }
  }

  async createMainEnquiry(dto: PartnerDetailDto) {
    const user = await this.accountRepo.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
        roles: dto.roles,
        createdBy: dto.accountId,
      },
    });

    if (user) {
      throw new ConflictException(
        "Phone number already exists with other account!"
      );
    } else {
      const setting = await this.settingRepo.save({
        type: dto.singleMultiType,
      });
      dto.settingId = setting.id;
      if(dto.password) dto.password = await bcrypt.hash(dto.password, 13);
      const accObj = Object.create({
        phoneNumber: dto.phoneNumber,
        roles: dto.roles,
        createdBy: dto.accountId,
        settingId: dto.settingId,
        password: dto.password
      });
      const account = await this.accountRepo.save(accObj);
      dto.accountId = account.id;
      this.createPermission(account.id);
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

  async findAllByCreator(accountId: string, dto: PaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .where(
        "account.createdBy = :createdBy AND account.roles = :roles AND partnerDetail.status = :status ",
        {
          createdBy: accountId,
          roles: dto.roles,
          status: dto.status,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where(
              "account.phoneNumber LIKE :phoneNumber OR partnerDetail.firmName LIKE :name OR partnerDetail.ownerName LIKE :ownerName",
              {
                phoneNumber: "%" + keyword + "%",
                name: "%" + keyword + "%",
                ownerName: "%" + keyword + "%",
              }
            );
          }
        })
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .leftJoinAndSelect("partnerDetail.updated", "updated")
      .leftJoinAndSelect("updated.staffDetail", "staffDetail")
      .leftJoinAndSelect("updated.partnerDetail", "spartnerDetail")
      .where("account.roles = :roles AND partnerDetail.status = :status", {
        roles: dto.roles,
        status: dto.status,
      })
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where(
              "account.phoneNumber LIKE :phoneNumber OR partnerDetail.firmName LIKE :name OR partnerDetail.ownerName LIKE :ownerName",
              {
                phoneNumber: "%" + keyword + "%",
                name: "%" + keyword + "%",
                ownerName: "%" + keyword + "%",
              }
            );
          }
        })
      )

      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }
  async findAllbyDashboard(dto: PaginationDtoWithDate, all: string) {
    const keyword = dto.keyword || "";
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const query = this.repo
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .leftJoinAndSelect("partnerDetail.updated", "updated")
      .leftJoinAndSelect("updated.staffDetail", "staffDetail")
      .leftJoinAndSelect("updated.partnerDetail", "spartnerDetail")
      .where("account.status = :accountStatus AND account.roles = :roles", {
        accountStatus: DefaultStatus.ACTIVE,
        roles: dto.roles,
        // status: DefaultStatus.ACTIVE,
      });
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
          if (keyword && keyword.length) {
            qb.where(
              "account.phoneNumber LIKE :phoneNumber OR partnerDetail.firmName LIKE :name OR partnerDetail.ownerName LIKE :ownerName",
              {
                phoneNumber: "%" + keyword + "%",
                name: "%" + keyword + "%",
                ownerName: "%" + keyword + "%",
              }
            );
          }
        })
      )
      .orderBy({ "account.createdAt": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async profile(accountId: string) {
    const result = await this.repo
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .where("partnerDetail.accountId = :accountId OR partnerDetail.id = :id", {
        accountId: accountId,
        id: accountId,
      })
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
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async update(id: string, dto: PartnerDetailDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    const object = Object.assign(result, dto);
    return this.repo.save(object);
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found !");
    }
    const object = Object.assign(result, status);
    return this.repo.save(object);
  }

  async image(image: string, result: PartnerDetail) {
    const obj = Object.assign(result, {
      logo: process.env.HOC_CDN_LINK + image,
      logoName: image,
    });
    return this.repo.save(obj);
  }

  async findListAll(roles: EventFor) {
    return this.repo
      .createQueryBuilder("partnerDetail")
      .select(["partnerDetail.id"])
      .leftJoinAndSelect("organizationDetail.account", "account")
      .where("account.roles = :roles AND partnerDetail.status = :status", {
        roles: roles,
        status: DefaultStatus.ACTIVE,
      })
      .getMany();
  }

  async findList(roles: UserRole, dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .select([
        "account.id",
        "account.roles",
        "partnerDetail.id",
        "partnerDetail.firmName",
        "partnerDetail.ownerName",
      ])
      .where("account.roles = :roles AND partnerDetail.status = :status", {
        roles: roles,
        status: DefaultStatus.ACTIVE,
      })
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where(
              "partnerDetail.firmName LIKE :name OR partnerDetail.ownerName LIKE :ownerName",
              {
                name: "%" + keyword + "%",
                ownerName: "%" + keyword + "%",
              }
            );
          }
        })
      )
      .orderBy({ "partnerDetail.firmName": "ASC" })
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
      .createQueryBuilder("partnerDetail")
      .leftJoinAndSelect("partnerDetail.account", "account")
      .select([
        "account.id",
        "account.roles",
        "partnerDetail.id",
        "partnerDetail.firmName",
        "partnerDetail.ownerName",
      ])
      .where(
        "account.roles = :roles AND partnerDetail.status = :status AND account.createdBy = :createdBy ",
        {
          roles: roles,
          status: DefaultStatus.ACTIVE,
          createdBy: accountId,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where(
              "partnerDetail.firmName LIKE :name OR partnerDetail.ownerName LIKE :ownerName",
              {
                name: "%" + keyword + "%",
                ownerName: "%" + keyword + "%",
              }
            );
          }
        })
      )
      .orderBy({ "partnerDetail.firmName": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }
}
