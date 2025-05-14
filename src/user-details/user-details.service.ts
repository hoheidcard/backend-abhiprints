import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Brackets, Repository } from 'typeorm';
import { UpdateUserDetailDto } from './dto/update-user-details';
import { UserDetailDto } from './dto/user-detail.dto';
import { UserDetail } from './entities/user-detail.entity';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetail) private readonly repo: Repository<UserDetail>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async create(dto: UserDetailDto) {
    const result = await this.repo.findOne({
      where: { accountId: dto.accountId },
    });

    try {
      if (result) {
        const obj = Object.assign(result, dto);
        return this.repo.save(obj);
      } else {
        const obj = Object.create(dto);
        return this.repo.save(obj);
      }
    } catch (error) {
      throw new NotAcceptableException(
        'Invalid detail or try after some time!',
      );
    }
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({
      where: { accountId: id },
    });
    if (!result) {
      throw new NotFoundException('User not found!');
    }
    return result;
  }

  async update(dto: UpdateUserDetailDto, accountId: string) {
    const result = await this.repo.findOne({
      where: { accountId: accountId },
    });
    if (!result) {
      throw new NotFoundException('User profile not found!');
    }
    try {
      if (dto.phoneNumber) {
        const account = await this.accountRepo.findOne({
          where: { id: dto.accountId },
        });
        if (account) {
          account.phoneNumber = dto.phoneNumber;
          await this.accountRepo.save(account);
        }
      }
      const obj = Object.assign(result, dto);
      return await this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException(
        'Invalid detail or try after some time!',
      );
    }
  }

  async findByUser(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("userDetail")
      .leftJoinAndSelect("userDetail.account", "account")
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            "account.phoneNumber LIKE :contactNo OR userDetail.firstName LIKE :name",
            {
              contactNo: "%" + keyword + "%",
              name: "%" + keyword + "%",
            }
          );
        })
      )
      .orderBy({ "userDetail.createdAt": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async profileImage(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      profile: process.env.HOC_CDN_LINK + image,
      profileName: image,
    });
    return this.repo.save(obj);
  }
}
