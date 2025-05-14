import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductDto } from "src/class-list/dto/class-list.dto";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus } from "src/enum";
import { Brackets, Not, Repository } from "typeorm";
import { DesignationDto } from "./dto/designation.dto";
import { Designation } from "./entities/designation.entity";
import { EditorDesignDto } from "src/id-cards-stock/dto/card-design.dto";
import { IdCardsStock } from "src/id-cards-stock/entities/id-cards-stock.entity";

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private readonly repo: Repository<Designation>,
    @InjectRepository(IdCardsStock)
    private readonly cardRepo: Repository<IdCardsStock>
  ) {}

  async create(dto: DesignationDto) {
    const result = await this.repo.findOne({
      where: {
        name: dto.name,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (result) {
      throw new ConflictException("Designation already added!");
    }
    const checkAready = await this.repo.findOne({
      where: {
        priority: dto.priority,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (checkAready) {
      throw new NotAcceptableException("Priority already exists!");
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll() {
    const [result, total] = await this.repo
      .createQueryBuilder("designation")
      .select(["designation.id", "designation.name", "designation.priority"])
      .orderBy({ "designation.priority": "ASC" })
      .getManyAndCount();

    return { result, total };
  }

  async findMyDesignation(settingId: string) {
    const [result, total] = await this.repo
      .createQueryBuilder("designation")
      .select(["designation.id", "designation.name", "designation.priority"])
      .where("designation.settingId = :settingId", { settingId })
      .orderBy({ "designation.priority": "ASC" })
      .getManyAndCount();

    return { result, total };
  }

  async findList(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("designation")
      .select([
        "designation.id",
        "designation.name",
        "designation.priority",
        "designation.createdAt",
      ])
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length > 0) {
            qb.where("designation.name LIKE :name", {
              name: "%" + keyword + "%",
            });
          }
        })
      )
      .orderBy({ "designation.priority": "ASC" })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result || result.status === DefaultStatus.DELETED) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async update(id: string, dto: DesignationDto) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    const checkAready = await this.repo.findOne({
      where: {
        id: Not(id),
        priority: dto.priority,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (checkAready) {
      throw new NotAcceptableException("Priority already exists!");
    }
    const obj = Object.assign(result, dto);
    return await this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    const obj = Object.assign(result, dto);
    return await this.repo.save(obj);
  }

  async updateEditor(id: string, settingId, dto: EditorDesignDto) {
    const result = await this.repo.findOne({ where: { id, settingId } });
    if (!result) {
      throw new NotFoundException(" Not Found !");
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
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
