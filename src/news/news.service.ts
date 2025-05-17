import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Like, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from 'src/common/dto/pagination-with-default-status.dto';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { DefaultStatusDto } from '../common/dto/default-status.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly repo: Repository<News>,
  ) {}

  async create(dto: CreateNewsDto) {
    const result = await this.repo.findOne({ where: { title: dto.title } });
    if (result) {
      throw new ConflictException('News Already Exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo.findAndCount({
      where: {
        status: dto.status,
        title: Like('%' + keyword + '%'),
        desc: Like('%' + keyword + '%'),
      },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, count };
  }

  async findByUser(dto: CommonPaginationDto) {
    const [result, count] = await this.repo.findAndCount({
      where: { status: DefaultStatus.ACTIVE },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, count };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('News not found..');
    }
    return result;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (result) {
      throw new NotFoundException('News Not Found!!');
    }
    const obj = Object.assign(result, updateNewsDto);
    return this.repo.save(obj);
  }

  async image(image: string, result: News) {
    const obj = Object.assign(result, {
      image: process.env.HOC_CDN_LINK + image,
      imagePath: image,
    });
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (result) {
      throw new NotFoundException('News Not Found!!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
