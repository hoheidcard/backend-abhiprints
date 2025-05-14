import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatePaginationDto } from "src/common/dto/pagination-with-date.dto";
import { DefaultStatus, EventFor, EventLowerFor } from "src/enum";
import { EventOrganizationsService } from "src/event-organizations/event-organizations.service";
import { OrganizationDetailsService } from "src/organization-details/organization-details.service";
import { PartnerDetailsService } from "src/partner-details/partner-details.service";
import { Brackets, Repository } from "typeorm";
import { EventDto, EventIdDto, PaginationDto } from "./dto/event.dto";
import { Event } from "./entities/event.entity";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repo: Repository<Event>,
    private readonly eventOrganizationService: EventOrganizationsService,
    private readonly organizationService: OrganizationDetailsService,
    private readonly partnerService: PartnerDetailsService
  ) {}

  async createMultiEventO(eventFor: EventFor, eventId: string) {
    const data = await this.organizationService.findListAll(eventFor);
    const arrayObj = [];
    data.forEach((element) => {
      arrayObj.push({
        organizationDetailId: element.id,
        partnerDetailId: null,
        eventId,
      });
    });
    this.eventOrganizationService.create(arrayObj);
  }

  async createMultiEventP(eventFor: EventFor, eventId: string) {
    const data = await this.organizationService.findListAll(eventFor);
    const arrayObj = [];
    data.forEach((element) => {
      arrayObj.push({
        organizationDetailId: null,
        partnerDetailId: element.id,
        eventId,
      });
    });
    this.eventOrganizationService.create(arrayObj);
  }

  async createSpecificEventO(events: EventIdDto[], eventId: string) {
    console.log(events);
    events.forEach((element) => {
      element.eventId = eventId;
    });
    this.eventOrganizationService.create(events);
  }

  async createSpecificEventP(events: EventIdDto[], eventId: string) {
    events.forEach((element) => {
      element.eventId = eventId;
    });
    this.eventOrganizationService.create(events);
  }

  async create(dto: EventDto) {
    // delete dto.all;
    delete dto.eventIds;
    const result = await this.repo.findOne({
      where: dto,
    });
    if (result) {
      throw new ConflictException("This event already exists!");
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: PaginationDto, accountId: string) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("event")
      .select([
        "event.id",
        "event.title",
        "event.desc",
        "event.all",
        "event.type",
        "event.eventDate",
        "event.fromTime",
        "event.toTime",
        "event.eventFor",
        "event.createdAt",
      ])
      .where(
        "event.status = :status AND event.eventFor = :eventFor AND event.accountId = :accountId",
        {
          status: DefaultStatus.ACTIVE,
          eventFor: dto.eventFor,
          accountId,
        }
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where("event.title LIKE :title OR event.desc LIKE :desc", {
              title: "%" + keyword + "%",
              desc: "%" + keyword + "%",
            });
          }
        })
      )
      .orderBy({ "event.eventDate": "DESC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }

  async findAllForAgents(
    dto: DatePaginationDto,
    partnerDetailId: string,
    type: EventLowerFor
  ) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.eventOrganization", "eventOrganization")
      .select([
        "event.id",
        "event.title",
        "event.desc",
        "event.all",
        "event.eventDate",
        "event.fromTime",
        "event.toTime",
        "event.eventFor",
        "event.type",
        "event.createdAt",
      ])
      .where(
        "event.eventDate >= :fromDate AND event.eventDate <= :toDate AND event.status = :status AND event.eventFor IN (:...eventFor) AND eventOrganization.partnerDetailId = :partnerDetailId and event.type = :type",
        {
          fromDate: fromDate,
          toDate: toDate,
          status: DefaultStatus.ACTIVE,
          eventFor: [EventFor.PARTNER, EventFor.SUB_PARTNER],
          partnerDetailId,
          type: type
        }
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where("event.title LIKE :title OR event.desc LIKE :desc", {
              title: "%" + keyword + "%",
              desc: "%" + keyword + "%",
            });
          }
        })
      )
      .orderBy({ "event.eventDate": "DESC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }

  async findAllForOrg(
    dto: DatePaginationDto,
    organizationDetailId: string,
    type: EventLowerFor
  ) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.eventOrganization", "eventOrganization")
      .select([
        "event.id",
        "event.title",
        "event.desc",
        "event.all",
        "event.eventDate",
        "event.fromTime",
        "event.toTime",
        "event.eventFor",
        "event.type",
        "event.createdAt",
      ])
      .where(
        "event.eventDate >= :fromDate AND event.eventDate <= :toDate AND event.status = :status AND event.eventFor IN (:...eventFor) AND eventOrganization.organizationDetailId = :organizationDetailId and event.type = :type",
        {
          fromDate: fromDate,
          toDate: toDate,
          status: DefaultStatus.ACTIVE,
          eventFor: [EventFor.SCHOOL, EventFor.COLLEGE, EventFor.ORGANIZATION],
          organizationDetailId,
          type: type
        }
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length) {
            qb.where("event.title LIKE :title OR event.desc LIKE :desc", {
              title: "%" + keyword + "%",
              desc: "%" + keyword + "%",
            });
          }
        })
      )
      .orderBy({ "event.eventDate": "DESC" })
      // .skip(dto.offset)
      // .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Event not found!");
    }
    return result;
  }

  async update(id: string, dto: EventDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const result = await this.findOne(id);
    return this.repo.remove(result);
  }
}
