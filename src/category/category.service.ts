import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "../common/dto/pagination-with-default-status.dto";
import { DefaultStatus } from "src/enum";
import { Like, Repository } from "typeorm";
import { CategoryDto } from "./dto/category.dto";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>
  ) {}

  async create(dto: CategoryDto) {
    const result = await this.repo.findOne({ where: { title: dto.title } });
    if (result) {
      throw new ConflictException("This card already exists");
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo.findAndCount({
      where: { status: dto.status, title: Like("%" + keyword + "%") },
      order: { title: "ASC" },
      skip: dto.offset,
      take: dto.limit,
    });
    return { result, total };
  }

  async find(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo.findAndCount({
      where: { status: DefaultStatus.ACTIVE, title: Like("%" + keyword + "%") },
      order: { title: "ASC" },
      skip: dto.offset,
      take: dto.limit,
    });
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async update(id: string, dto: CategoryDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, status);
    return this.repo.save(obj);
  }

  async image(image: string, result: Category) {
    const obj = Object.assign(result, {
      image: process.env.HOC_CDN_LINK + image,
      imageName: image,
    });
    return this.repo.save(obj);
  }
}
