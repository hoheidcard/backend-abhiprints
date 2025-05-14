import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus } from "src/enum";
import { Brackets, Not, Repository } from "typeorm";
import { ClassDivDto } from "./dto/class-div.dto";
import { ClassDiv } from "./entities/class-div.entity";

@Injectable()
export class ClassDivService {
  constructor(
    @InjectRepository(ClassDiv) private readonly repo: Repository<ClassDiv>
  ) {}

  async create(dto: ClassDivDto) {
    const result = await this.repo.findOne({
      where: {
        name: dto.name,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (result && result.status != DefaultStatus.DELETED) {
      throw new ConflictException("Class Section Already Added!");
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

  async findAll(query: CommonPaginationDto) {
    const keyword = query.keyword || "";
    const [result, count] = await this.repo
      .createQueryBuilder("classDiv")
      .select([
        "classDiv.id",
        "classDiv.name",
        "classDiv.priority",
        "classDiv.createdAt",
      ])
      .andWhere(
        new Brackets((qb) => {
          qb.where("classDiv.name LIKE :name", { name: "%" + keyword + "%" });
        })
      )
      .orderBy({ "classDiv.priority": "ASC" })
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, count };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async update(id: string, dto: ClassDivDto) {
    const result = await this.findOne(id);
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
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
