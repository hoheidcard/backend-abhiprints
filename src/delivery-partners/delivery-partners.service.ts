import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { DefaultStatus } from 'src/enum';
import { Repository } from 'typeorm';
import { DeliveryPartnerDto } from './dto/delivery-partner.dto';
import { DeliveryPartner } from './entities/delivery-partner.entity';

@Injectable()
export class DeliveryPartnersService {
  constructor(
    @InjectRepository(DeliveryPartner)
    private readonly repo: Repository<DeliveryPartner>,
  ) {}

  async create(dto: DeliveryPartnerDto) {
    const result = await this.repo.findOne({ where: { title: dto.title } });
    if (result) {
      throw new ConflictException('This card already exists');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll() {
    const [result, total] = await this.repo.findAndCount({
      where: { status: DefaultStatus.ACTIVE },
      order: { title: 'ASC' },
    });
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Not Found!');
    }
    return result;
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, status);
    return this.repo.save(obj);
  }
}
