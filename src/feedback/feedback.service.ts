import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { FeedbackDto, PaginationDto, StatusDto } from './dto/feedback.dto';
import { Feedback } from './entities/feedback.entity';


@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private readonly repo: Repository<Feedback>,
  ) {}

  async create(dto: FeedbackDto) {
    const result = await this.repo.findOne({
      where: { accountId: dto.accountId, desc: dto.desc },
    });
    if (result) {
      throw new ConflictException('Thank you for your valuable feedback!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: PaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.account', 'account')
      // .leftJoinAndSelect('account.doctorDetail', 'doctorDetail')
      // .leftJoinAndSelect('account.staffDetail', 'staffDetail')
      // .leftJoinAndSelect('account.userDetail', 'userDetail')
      .select([
        'feedback.id',
        'feedback.desc',
        'feedback.status',
        'feedback.createdAt',
        'account.id',
        'account.phoneNumber',
        // 'userDetail.name',
        // 'staffDetail.name',
        // 'doctorDetail.name',
      ])
      .where('feedback.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'feedback.desc LIKE :desc',
            {
              desc: '%' + keyword + '%',
              dname: '%' + keyword + '%',
              sname: '%' + keyword + '%',
              uname: '%' + keyword + '%',
            },
          );
        }),
      )
      .orderBy({ 'feedback.createdAt': 'DESC' })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async find() {
    return this.repo
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.account', 'account')
      .leftJoinAndSelect('account.doctorDetail', 'doctorDetail')
      .leftJoinAndSelect('account.staffDetail', 'staffDetail')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .select([
        'feedback.id',
        'feedback.desc',
        'account.id',
        'userDetail.name',
        'staffDetail.name',
        'doctorDetail.name',
      ])
      .where('feedback.status = :status', { status: true })
      .orderBy({ 'feedback.createdAt': 'DESC' })
      .skip(0)
      .take(10)
      .getMany();
  }

  async update(id: string, dto: FeedbackDto) {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException('Feedback not found!');
    }
    const obj = Object.assign(id, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: StatusDto) {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException('Feedback not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
