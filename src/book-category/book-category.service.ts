import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus } from "src/enum";
import { Brackets, Repository } from "typeorm";
import { BookCategoryDto } from "./dto/book-category.dto";
import { BookCategory } from "./entities/book-category.entity";

@Injectable()
export class BookCategoryService {
  constructor(
    @InjectRepository(BookCategory)
    private readonly repo: Repository<BookCategory>
  ) {}

  async create(dto: BookCategoryDto) {
    const result = await this.repo.findOne({
      where: {
        name: dto.name,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (result) {
      throw new BadRequestException("Category Name Already exist!");
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(query: CommonPaginationDto) {
    const keyword = query.keyword || "";
    const [result, total] = await this.repo
      .createQueryBuilder("bookCategory")
      .select([
        "bookCategory.id",
        "bookCategory.name",
        "bookCategory.createdAt",
      ])
      .andWhere(
        new Brackets((qb) => {
          if (keyword) {
            qb.where("bookCategory.name LIKE :name", {
              name: "%" + keyword + "%",
            });
          }
        })
      )
      .orderBy({ "bookCategory.createdAt": "DESC" })
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }

    return result;
  }

  async update(id: string, updateBookCategoryDto: BookCategoryDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    const obj = Object.assign(result, updateBookCategoryDto);
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
