import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffSubjectDto } from './dto/create-staff-subject.dto';
import { StaffSubject } from './entities/staff-subject.entity';

@Injectable()
export class StaffSubjectService {
  constructor(
    @InjectRepository(StaffSubject)
    private readonly repo: Repository<StaffSubject>,
  ) {}

  async create(dto: CreateStaffSubjectDto) {
    const result = await this.repo.findOne({
      where: {
        staffDetailId: dto.staffDetailId,
        subjectId: dto.subjectId,
      },
    });
    if (!result) {
      const object = Object.create(dto);
      return this.repo.save(object);
    } else {
      return new ConflictException('Subject Already added !');
    }
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException('Not Found!');
    }
    return this.repo.remove(result);
  }
}
