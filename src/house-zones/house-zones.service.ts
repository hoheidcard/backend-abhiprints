import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDto } from "src/class-list/dto/class-list.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "../common/dto/pagination-with-default-status.dto";
import { DefaultStatus } from "src/enum";
import { EditorDesignDto } from "src/id-cards-stock/dto/card-design.dto";
import { Brackets, Repository } from "typeorm";
import { CreateHouseZoneDto } from "./dto/create-house-zone.dto";
import { UpdateHouseZoneDto } from "./dto/update-house-zone.dto";
import { HouseZone } from "./entities/house-zone.entity";
import { IdCardsStock } from "src/id-cards-stock/entities/id-cards-stock.entity";

@Injectable()
export class HouseZonesService {
  constructor(
    @InjectRepository(HouseZone)
    private readonly repo: Repository<HouseZone>,
    @InjectRepository(IdCardsStock)
    private readonly cardRepo: Repository<IdCardsStock>
  ) {}
  async create(dto: CreateHouseZoneDto) {
    const result = await this.repo.findOne({
      where: {
        name: dto.name,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (result) {
      throw new ConflictException("House Zone Already Added !");
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(
    accountId: string,
    settingId: string,
    query: DefaultStatusPaginationDto
  ) {
    const keyword = query.keyword || " ";
    const status = query.status;
    const [result, total] = await this.repo
      .createQueryBuilder("houseZone")
      .select([
        "houseZone.id",
        "houseZone.name",
        "department.status",
        "houseZone.createdAt",
        "houseZone.accountId",
        "houseZone.settingId",
      ])
      .where(
        "houseZone.accountId = :accountId OR houseZone.settingId = :settingId",
        { accountId: accountId, settingId: settingId }
      )
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length > 0) {
            qb.where("houseZone.name LIKE :name", {
              name: "%" + keyword + "%",
            });
          }
          if (status) {
            qb.orWhere("houseZone.status = :status", { status: status });
          }
        })
      )
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException(" Not Found !");
    }
    return result;
  }

  async update(id: string, updateHouseZoneDto: UpdateHouseZoneDto) {
    const result = await this.findOne(id);
    const object = Object.assign(result, updateHouseZoneDto);
    return await this.repo.save(object);
  }

  async updateEditor(id: string, settingId, dto: EditorDesignDto) {
    const result = await this.repo.findOne({ where: { id, settingId } });
    if (!result) {
      throw new NotFoundException(" Not Found !");
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, statusDto: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (!result || result.status === DefaultStatus.DELETED) {
      throw new NotFoundException("Not Found!");
    }

    const object = Object.assign(result, statusDto);
    return await this.repo.save(object);
  }

  async products(dto: ProductDto[]) {
    if (dto.length > 0) {
      const stock = await this.cardRepo.findOne({
        select: ["card"],
        where: { id: dto[0].idCardsStockId },
      });
      if(!stock) {
        throw new NotAcceptableException('Please card first!');
      }
      dto.forEach((element) => {
        element.card = stock.card;
      });
    }

    return this.repo.save(dto);
  }
}
