import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonPaginationDto } from '../common/dto/common-pagination.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { DefaultStatusPaginationDto } from '../common/dto/pagination-with-default-status.dto';
import { DefaultStatus } from '../enum';
import { Brackets, Repository } from 'typeorm';
import { NoticeDto } from './dto/notice.dto';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice) private readonly repo: Repository<Notice>,
  ) {}

  async create(dto: NoticeDto) {
    const result = await this.repo.findOne({
      where: { desc: dto.desc, title: dto.title, settingId: dto.settingId },
    });
    if (result) {
      throw new ConflictException('Notice already exists!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(
    organizationDetailId: string,
    query: DefaultStatusPaginationDto,
  ) {
    const keyword = query.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('notice')
      .select([
        'notice.id',
        'notice.title',
        'notice.desc',
        'notice.status',
        'notice.createdAt',
      ])
      .where(
        'notice.status = :status ANd notice.organizationDetailId = :organizationDetailId',
        { status: query.status, organizationDetailId },
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword) {
            qb.where('notice.title LIKE :title OR notice.desc LIKE :desc', {
              title: '%' + keyword + '%',
              desc: '%' + keyword + '%',
            });
          }
        }),
      )
      .orderBy({ 'notice.createdAt': 'DESC' })
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findAllFroStudent(organizationDetailId: string ,query: CommonPaginationDto) {
    const keyword = query.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('notice')
      .select([
        'notice.id',
        'notice.title',
        'notice.desc',
        'notice.status',
        'notice.createdAt',
      ])
      .where(
        'notice.status = :status AND notice.organizationDetailId = :organizationDetailId',
        {
          status: DefaultStatus.ACTIVE,
          organizationDetailId,
        },
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword) {
            qb.where('notice.title LIKE :title OR notice.desc LIKE :desc', {
              title: '%' + keyword + '%',
              desc: '%' + keyword + '%',
            });
          }
        }),
      )
      .orderBy({ 'notice.createdAt': 'DESC' })
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException('Not Found!');
    }
    return result;
  }

  async update(id: string, dto: NoticeDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
