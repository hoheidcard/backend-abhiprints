import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusPaginationDto } from "../common/dto/pagination-with-default-status.dto";
import { BannerType, DefaultStatus } from "src/enum";
import { Repository } from "typeorm";
import { BannerDto } from "./dto/create-banner.dto";
import { Banner } from "./entities/banner.entity";

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly repo: Repository<Banner>
  ) {}

  async create(type: BannerType, date: string, image: string) {
    const obj = Object.assign({
      image: process.env.HOC_CDN_LINK + image,
      imageName: image,
      date: type === BannerType.DEAL ? new Date(date) : null,
      type: type,
    });
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const [result, total] = await this.repo.findAndCount({
      where: { status: dto.status },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, total };
  }

  async findByUser(dto: CommonPaginationDto) {
    const [result, count] = await this.repo.findAndCount({
      select: ["id", "image", "type"],
      where: { status: DefaultStatus.ACTIVE },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, count };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Banner Not Found..");
    }
    return result;
  }

  async image(image: string, result: Banner) {
    const obj = Object.assign(result, {
      image: process.env.HOC_CDN_LINK + image,
      imageName: image,
    });
    return this.repo.save(obj);
  }

  async status(id: string, dto: BannerDto) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Banner Not Found..");
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
