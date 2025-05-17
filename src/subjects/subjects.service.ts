import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus } from "src/enum";
import { Brackets, Repository } from "typeorm";
import { SubjectDto } from "./dto/subject.dto";
import { Subject } from "./entities/subject.entity";

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject) private readonly repo: Repository<Subject>
  ) {}

  async create(dto: SubjectDto) {
    const subject = await this.repo.findOne({
      where: {
        name: dto.name,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });

    if (subject) {
      throw new ConflictException("Subject Already Added!");
    }
    const object = Object.create(dto);
    return this.repo.save(object);
  }

  async findAll(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("subjects")
      .select(["subjects.id", "subjects.name", "subjects.createdAt"])
      .andWhere(
        new Brackets((qb) => {
          if (keyword && keyword.length > 0) {
            qb.where("subjects.name LIKE :name", { name: "%" + keyword + "%" });
          }
        })
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async update(id: string, dto: SubjectDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    const obj = Object.assign(result, status);
    return this.repo.save(obj);
  }
}
