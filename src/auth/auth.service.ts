import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject, 
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { Cache } from "cache-manager";
import { Account } from "../account/entities/account.entity";
import { LogType, UserRole } from "../enum";
import { LoginHistory } from "../login-history/entities/login-history.entity";
import { UserPermission } from "../user-permissions/entities/user-permission.entity";
import APIFeatures from "../utils/apiFeatures.utils";
import { Repository } from "typeorm";
import { ResetPasswordDto, SigninDto } from "./dto/login.dto";
import { CreateDetailDto } from "../user-details/dto/user-detail.dto";
import { UserDetail } from "../user-details/entities/user-detail.entity";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(LoginHistory)
    private readonly logRepo: Repository<LoginHistory>,
    @InjectRepository(UserPermission)
    private readonly upRepo: Repository<UserPermission>,
    @InjectRepository(UserDetail)
    private readonly userDetailRepo: Repository<UserDetail>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async signIn(dto: SigninDto) {
    const user = await this.getUserDetails(dto.loginId, dto.roles);
    if (!user) {
      throw new NotFoundException("Account not found!");
    }
    console.log(user)
    if (dto.passwordStatus) {
      if(!user.password){
        throw new UnauthorizedException("Invalid Credentials");
      }
      const comparePassword = await bcrypt.compare(dto.password, user.password);
      if (!comparePassword) {
        throw new UnauthorizedException("Invalid Credentials");
      }
      const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);
      return { user, token };
    }
    // const otp = Math.floor(1000 + Math.random() * 9000);
    const otp = 7832;
    await this.cacheManager.set(user.phoneNumber, otp, 10 * 60 * 1000);
    // await sendOtp(user.phoneNumber, otp);

    return { loginId: dto.loginId };
  }

  async reset(dto: ResetPasswordDto) {
    const user = await this.getUserDetails(dto.loginId, dto.roles);
    if (!user) {
      throw new NotFoundException("Account not found!");
    }
    // const otp = Math.floor(1000 + Math.random() * 9000);
    const otp = 7832;
    await this.cacheManager.set(user.phoneNumber, otp, 10 * 60 * 1000);
    // await sendOtp(user.phoneNumber, otp);

    return { loginId: dto.loginId };
  }

  async verifyOtp(
    phoneNumber: string,
    otp: number,
    ip: string,
    origin: string
  ) {
    const user = await this.getUserDetails(phoneNumber);

    const sentOtp = await this.cacheManager.get(phoneNumber);

    if (otp != sentOtp) {
      throw new UnauthorizedException("Invalid otp!");
    }

    const obj = Object.create({
      ip: ip,
      origin: origin,
      type: LogType.LOGIN,
      accountId: user.id,
    });
    await this.logRepo.save(obj);

    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);

    return {
      token,
      user,
    };
  }

  async verifyForgotOtp(phoneNumber: string, otp: number) {
    const user = await this.getUserDetails(phoneNumber);

    const sentOtp = await this.cacheManager.get(phoneNumber);

    if (otp != sentOtp) {
      throw new NotAcceptableException("Invalid otp!");
    }

    return { id: user.id };
  }

  async logout(accountId: string, browser: string, ip: string) {
    const obj = Object.create({
      ip: ip,
      type: LogType.LOGOUT,
      accountId: accountId,
    });
    return this.logRepo.save(obj);
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  async validateByToken(token: string) {
    try {
      const { id } = await this.jwtService.verify(token.replace("Bearer ", "")); // Verify and decode the JWT token
      return this.getUserDetails(id);
    } catch (error) {
      throw new UnauthorizedException("Authentication failed!");
    }
  }

  async userLogin(loginId: string) {
    let user = await this.repo.findOne({
      where: { phoneNumber: loginId },
    });
    if (!user) {
      const obj = Object.create({
        phoneNumber: loginId,
        // type: LoginType.PHONE,
        roles: UserRole.USER,
      });
      user = await this.repo.save(obj);
      this.createOrUpdate({
        name: null,
        profile: null,
        accountId: user.id,
      });
    }
    // const fcmObj = Object.assign(user,{fcm: fcm});
    // await this.repo.save(fcmObj);

    const otp = 7832;
    // const otp = Math.floor(1000 + Math.random() * 9000);
    // sendOtp(+loginId, otp);
    this.cacheManager.set(loginId, otp, 10 * 60 * 1000);
    return { loginId };
  }

  async createOrUpdate(dto: CreateDetailDto) {
    const result = await this.userDetailRepo.findOne({
      where: { accountId: dto.accountId },
    });
    if (result) {
      const obj = Object.assign(result, dto);
      return this.userDetailRepo.save(obj);
    } else {
      const obj = Object.create(dto);
      return this.userDetailRepo.save(obj);
    }
  }

  findPermission(accountId: string) {
    return this.getPermissions(accountId);
  }

  private getPermissions = async (accountId: string): Promise<any> => {
    let result = await this.cacheManager.get("userPermission" + accountId);
    if (!result) {
      result = await this.upRepo.find({
        relations: ["permission", "menu"],
        where: { accountId, status: true },
      });
      this.cacheManager.set(
        "userPermission" + accountId,
        result,
        7 * 24 * 60 * 60 * 1000
      );
    }
    return result;
  };

  private getUserDetails = async (
    id: string,
    role?: UserRole
  ): Promise<any> => {
    let result = await this.cacheManager.get("userDetail" + id);
    if (!result) {
      const query = this.repo
        .createQueryBuilder("account")
        .leftJoinAndSelect("account.organizationDetail", "organizationDetail")
        .leftJoinAndSelect("account.partnerDetail", "partnerDetail")
        .leftJoinAndSelect("account.staffDetail", "staffDetail")
        .leftJoinAndSelect("staffDetail.organizationDetail", "sorganizationDetail")
        .leftJoinAndSelect("staffDetail.partnerDetail", "spartnerDetail")
        .leftJoinAndSelect("account.setting", "setting")
        .select([
          "account.id",
          "account.password",
          "account.phoneNumber",
          "account.roles",
          "account.password",
          "account.lastStatus",
          "account.status",
          "account.createdBy",
          "account.settingId",
          "setting.id",
          "setting.type",

          "organizationDetail.id",
          "organizationDetail.accountId",
          "organizationDetail.type",
          "partnerDetail.id",
          "partnerDetail.accountId",

          "staffDetail.id",
          "sorganizationDetail.id",
          "sorganizationDetail.accountId",
          "organizationDetail.type",
          "spartnerDetail.id",
          "spartnerDetail.accountId",
        ])
        .where("account.id = :id OR account.phoneNumber = :phoneNumbers", {
          id: id,
          phoneNumbers: id,
        });
      if (role == UserRole.ROOT) {
        query.andWhere("account.roles IN (:...roles)", {
          roles: [UserRole.ROOT, UserRole.ADMIN, UserRole.STAFF],
        });
      }
      if (role == UserRole.SCHOOL || role == UserRole.COLLEGE) {
        query.andWhere("account.roles IN (:...roles)", {
          roles: [UserRole.SCHOOL, UserRole.STAFF, UserRole.COLLEGE],
        });
      }
      if (role == UserRole.ORGANIZATION) {
        query.andWhere("account.roles IN (:...roles)", {
          roles: [UserRole.ORGANIZATION, UserRole.STAFF],
        });
      }
      if (role == UserRole.PARENT || role == UserRole.STUDENT) {
        query.andWhere("account.roles IN (:...roles)", {
          roles: [UserRole.STUDENT, UserRole.PARENT],
        });
      }
      if (role == UserRole.PARTNER) {
        query.andWhere("account.roles IN (:...roles)", {
          roles: [UserRole.PARTNER, UserRole.STAFF],
        });
      }
      if (role == UserRole.SUB_PARTNER) {
        query.andWhere("account.roles IN (:...roles)", {
          roles: [UserRole.SUB_PARTNER, UserRole.STAFF],
        });
      }
      result = await query.getOne();
      if (!result) {
        throw new NotFoundException("Account not found!");
      }
      this.cacheManager.set(
        "userDetail" + result["id"],
        result,
        7 * 24 * 60 * 60 * 1000
      );
    }
    return result;
  };
}
