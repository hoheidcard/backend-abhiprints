import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DefaultStatusPaginationDto } from '../common/dto/pagination-with-default-status.dto';
import { DefaultStatus, SMType, UserRole } from '../enum';
import { Setting } from '../settings/entities/setting.entity';
import { StaffDetail } from '../staff-details/entities/staff-detail.entity';
import { Brackets, Repository } from 'typeorm';
import {
  CreateAccountDto,
  PasswordDto,
  PasswordWithOldDto,
} from './dto/account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
    @InjectRepository(StaffDetail)
    private readonly staffRepo: Repository<StaffDetail>,
  ) {}

  async create(dto: CreateAccountDto, createdBy: string) {
    const user = await this.repo.findOne({
      where: { phoneNumber: dto.phoneNumber, roles: dto.roles },
    });
    if (user) {
      throw new ConflictException('Login id already exists!');
    }
    const setting = await this.settingRepo.save({
      type: SMType.SINGLE,
    });
    const encryptedPassword = await bcrypt.hash(dto.password, 13);
    const obj = Object.create({
      phoneNumber: dto.phoneNumber,
      password: encryptedPassword,
      createdBy,
      roles: UserRole.ADMIN,
      settingId: setting.id,
    });
    const payload = await this.repo.save(obj);
    const object = Object.create({
      name: dto.name,
      emailId: dto.emailId,
      gender: dto.gender,
      dob: dto.dob,
      accountId: payload.id,
    });
    if (dto.roles === UserRole.ADMIN) {
      this.staffRepo.save(object);
    }
    return payload;
  }

  async find(dto: DefaultStatusPaginationDto, createdBy: string) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.staffDetail', 'staffDetail')
      .where(
        'account.status = :status AND account.roles = :roles AND account.createdBy = :createdBy',
        {
          status: dto.status,
          roles: UserRole.ADMIN,
          createdBy: createdBy,
        },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'account.phoneNumber LIKE :phoneNumber OR staffDetail.name LIKE :pname',
            {
              phoneNumber: '%' + keyword + '%',
              pname: '%' + keyword + '%',
            },
          );
        }),
      )
      .orderBy({ 'staffDetail.name': 'ASC' })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      relations: ['staffDetail'],
      where: { id },
    });
    if (!user) {
      throw new ConflictException('User not found!');
    }

    return user;
  }

  async findProfile(id: string) {
    const result = await this.repo
      .createQueryBuilder("account")
      .leftJoinAndSelect("account.userDetail", "userDetail")
      .where("account.id = :id", { id: id })
      .getOne();
    if (!result) return new ConflictException("User Not Found");
    return result;
  }
  
  async status(id: string, status: DefaultStatus) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(user, status);
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(user, { status: DefaultStatus.DELETED });
    return this.repo.save(user);
  }

  async updateOwnPassword(dto: PasswordWithOldDto, id: string) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User detail not found!');
    }

    const comparePassword = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!comparePassword) {
      throw new NotAcceptableException('Incorrect old password!');
    }

    const epassword = await bcrypt.hash(dto.password, 13);

    const obj = Object.assign(user, {
      password: epassword,
    });
    return this.repo.save(obj);
  }

  async updatePassword(dto: PasswordDto, id: string) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User detail not found!');
    }
    const epassword = await bcrypt.hash(dto.password, 13);

    const obj = Object.assign(user, {
      password: epassword,
    });
    return this.repo.save(obj);
  }
}
