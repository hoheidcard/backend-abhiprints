import { Injectable } from '@nestjs/common';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { ContactUsPaginationDto } from './dto/update-contact-us.dto';
import { ContactUs } from './entities/contact-us.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly repo: Repository<ContactUs>,
  ) {}

  async create(dto: CreateContactUsDto) {
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: ContactUsPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('contactUs')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'contactUs.name LIKE :name OR contactUs.email LIKE :email OR contactUs.mobile LIKE :mobile OR contactUs.feedback LIKE :feedback',
            {
              name: '%' + keyword + '%',
              email: '%' + keyword + '%',
              mobile: '%' + keyword + '%',
              feedback: '%' + keyword + '%',
            },
          );
        }),
      )
      .orderBy({ 'contactUs.createdAt': 'DESC' })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, count };
  }
}
