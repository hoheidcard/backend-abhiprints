import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultStatus } from '../enum';
import { Repository } from 'typeorm';
import { AddressDto } from './dto/user-address.dto';
import { UserAddress } from './entities/user-address.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly repo: Repository<UserAddress>,
  ) {}

  async create(dto: AddressDto) {
    const counnt = await this.repo.count({
      where: { accountId: dto.accountId },
    });
    if(counnt>4) {
      throw new NotFoundException('Only 5 Address Allowed!');
    }
    const result = await this.repo.findOne({
      where: { accountId: dto.accountId, address: dto.address },
    });
    if (result && result.status != DefaultStatus.DELETED) {
      throw new ConflictException('Address already exists!');
    }
    dto['status'] = DefaultStatus.ACTIVE
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findOne(accountId: string) {
    const [result, count] = await this.repo
      .createQueryBuilder('userAddress')
      .where(
        'userAddress.accountId = :accountId AND userAddress.status IN (:...status)',
        { accountId, status: [DefaultStatus.ACTIVE, DefaultStatus.DEACTIVE] },
      )
      .getManyAndCount();
    return { result, count };
  }

  async update(id: string, dto: AddressDto) {
    const result = await this.repo.findOne({
      where: { id, accountId: dto.accountId },
    });
    if (!result) {
      throw new NotFoundException('Address not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async defaultAddress(id: string, accountId: string) {
    const result = await this.repo.findOne({
      where: { id: id, accountId: accountId },
    });
    if (!result) {
      throw new NotFoundException('Address not found!');
    }
    await this.repo
      .createQueryBuilder('userAddress')
      .update()
      .set({ status: DefaultStatus.DEACTIVE })
      .where({ accountId: accountId })
      .execute();
    const obj = Object.assign(result, { status: DefaultStatus.ACTIVE });
    return this.repo.save(obj);
  }

  async remove(id: string, accountId: string) {
    const result = await this.repo.findOne({
      where: { id, accountId },
    });
    if (!result) {
      throw new NotFoundException('Address not found!');
    }
    const obj = Object.assign(result, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
