import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageDto } from './dto/page.dto';
import { Page } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page) private readonly repo: Repository<Page>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const page = await this.repo.findOne({ where: { id } });
    if (!page) {
      throw new NotFoundException('Not found!');
    }
    return page;
  }
  async update(id: number, updatedId: string, dto: PageDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Page not found!');
    }
    const obj = Object.assign(result, { desc: dto.desc, updatedId });
    return this.repo.save(obj);
  }
}
