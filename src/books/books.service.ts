import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookCategory } from 'src/book-category/entities/book-category.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/pagination-with-default-status.dto';
import { Brackets, Repository } from 'typeorm';
import { BookDto } from './dto/book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly repo: Repository<Book>,
    @InjectRepository(BookCategory)
    private readonly repoBookCategory: Repository<BookCategory>,
  ) {}

  async createCSV(dto: any, organizationDetailId: string, settingId: string) {
    try {
      const result = await this.repo.findOne({
        where: {
          organizationDetailId,
          name: dto.name,
          code: dto.code,
          settingId: settingId,
        },
      });
      if (!result) {
        const obj = Object.assign(dto);
        this.repo.save(obj);
        return 'New';
      }
      return 'Old';
    } catch (error) {
      return 'Old';
    }
  }

  async create(dto: BookDto) {
    const result = await this.repo.findOne({
      where: { name: dto.name, settingId: dto.settingId },
    });
    if (result) {
      throw new BadRequestException('Book  Name Already exist!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(
    organizationDetailId: string,
    query: DefaultStatusPaginationDto,
  ) {
    const keyword = query.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.bookCategory', 'bookCategory')
      .leftJoinAndSelect('book.classList', 'classList')
      .select([
        'book.id',
        'book.name',
        'book.author',
        'book.quantity',
        'book.image',
        'book.code',
        'book.shortDesc',
        'book.status',
        'book.createdAt',

        'bookCategory.id',
        'bookCategory.name',

        'classList.id',
        'classList.name',
      ])
      .where(
        'book.status = :status AND book.organizationDetailId = :organizationDetailId',
        { status: query.status, organizationDetailId },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('book.name LIKE :name', { name: '%' + keyword + '%' });
        }),
      )
      .orderBy({ 'book.createdAt': 'DESC' })
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException('Not Found!');
    }
    return result;
  }

  async update(id: string, dto: BookDto) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException('Not Found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException('Not Found!');
    }
    const object = Object.assign(result, dto);
    return this.repo.save(object);
  }

  async image(image: string, result: Book) {
    const obj = Object.assign(result, {
      image: process.env.HOC_CDN_LINK + image,
      imageName: image,
    });
    return this.repo.save(obj);
  }

  async findCategory(settingId: string) {
    return this.repoBookCategory.find({
      select: ['id', 'name'],
      where: { settingId },
    });
  }
}
