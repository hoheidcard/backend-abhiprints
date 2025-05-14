import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultStatus } from 'src/enum';
import { EventIdDto, PaginationDto } from 'src/events/dto/event.dto';
import { Brackets, Repository } from 'typeorm';
import { EventOrganization } from './entities/event-organization.entity';

@Injectable()
export class EventOrganizationsService {
  constructor(
    @InjectRepository(EventOrganization)
    private readonly repo: Repository<EventOrganization>,
  ) {}

  create(dto: EventIdDto[]) {
    return this.repo.save(dto);
  }

  async findAll(dto: PaginationDto) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('eventOrganization')
      .leftJoinAndSelect('eventOrganization.event', 'event')
      .select([
        'eventOrganization.id',
        'event.id',
        'event.title',
        'event.eventDate',
        'event.fromTime',
        'event.toTime',
        'event.eventFor',
        'event.createdAt',
      ])
      .where('event.status = :status AND event.eventFor = :eventFor', {
        status: DefaultStatus.ACTIVE,
        eventFor: dto.eventFor,
      })
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where('event.title LIKE :title OR event.desc LIKE :desc', {
              title: '%' + keyword + '%',
              desc: '%' + keyword + '%',
            });
          }
        }),
      )
      .orderBy({ 'event.eventDate': 'DESC' })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }
}
