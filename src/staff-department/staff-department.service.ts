import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffDepartmentDto } from './dto/staff-department.dto';
import { StaffDepartment } from './entities/staff-department.entity';

@Injectable()
export class StaffDepartmentService {
  constructor(
    @InjectRepository(StaffDepartment)
    private readonly repo: Repository<StaffDepartment>,
  ) {}

  async create(dto: StaffDepartmentDto) {
    const result = await this.repo.findOne({
      where: {
        staffDetailId: dto.staffDetailId,
        departmentId: dto.departmentId,
      },
    });
    if (!result) {
      const object = Object.create(dto);
      return this.repo.save(object);
    } else {
      return new ConflictException('Department Already added !');
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
