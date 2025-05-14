import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { Brackets, Repository } from 'typeorm';
import { FaqAnswerDto, FaqDto } from './dto/faq.dto';
import { Faq } from './entities/faq.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/pagination-with-default-status.dto';
import { UpdateStatus } from './dto/update-faq.dto';

@Injectable()
export class FaqsService {
  constructor(@InjectRepository(Faq) private readonly repo: Repository<Faq>) {}

  async create(dto: FaqDto) {
    const result = await this.repo.findOne({
      where: { accountId: dto.accountId, question: dto.question },
    });
    if (result) {
      throw new ConflictException('This question already exists!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('faq')
      .where('faq.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('faq.question LIKE :question OR faq.answer LIKE :answer', {
            question: '%' + keyword + '%',
            answer: '%' + keyword + '%',
          });
        }),
      )
      .orderBy({ 'faq.createdAt': 'DESC' })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }

  async find(dto: CommonPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('faq')
      .where('faq.status = :status', {
        status: DefaultStatus.ACTIVE,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('faq.question LIKE :question OR faq.answer LIKE :answer', {
            question: '%' + keyword + '%',
            answer: '%' + keyword + '%',
          });
        }),
      )
      .orderBy({ 'faq.createdAt': 'DESC' })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }

  async update(id: string, dto: FaqAnswerDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Question not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  
  async status(id: string, dto: UpdateStatus) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Question not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
