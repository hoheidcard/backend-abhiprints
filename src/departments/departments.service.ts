import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentDto } from './dto/department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from '../common/dto/pagination-with-default-status.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { UpdateDepartmentDto } from './dto/update-depertmant.dto';
import { DefaultStatus } from '../enum';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) { }
  async create(dto: DepartmentDto) {
    const result = await this.repo.findOne({
      where: { name: dto.name, status: DefaultStatus.ACTIVE },
    });
    if (result) {
      throw new ConflictException('Depertment already added !')
    }
    const obj = Object.assign(dto)
    return this.repo.save(obj)

  }

  async findAll(accountId: string, query: DefaultStatusPaginationDto) {
    const keyword = query.keyword || ' '
    const status = query.status
    const [result, total] = await this.repo.createQueryBuilder('department')
      .select([
        'department.id',
        'department.name',
        'department.status',
        'department.createdAt',
        'department.accountId',
        'department.settingId'
      ])
      .where('department.accountId = :accountId', { accountId: accountId })
      .andWhere(new Brackets((qb) => {
        if (keyword && keyword.length > 0) {
          qb.where('department.name LIKE :name', { name: '%' + keyword + '%' })
        }
        if (status) {
          qb.orWhere('department.status = :status', { status: status })
        }
      })
      )
      .take(query.limit)
      .skip(query.offset).
      getManyAndCount()
    return { result, total }
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id: id } })
    if (!result || result.status === DefaultStatus.DELETED) {
      throw new NotFoundException('Not Found!');
    }
    return result
  }
  async update(id: string, departmentDto: UpdateDepartmentDto) {
    const result = await this.findOne(id)
    if (!result) {
      throw new NotFoundException(' Not Found !')
    }
    const object = Object.assign(result, departmentDto)
    return await this.repo.save(object)
  }

  async status(id: string,statusDto:DefaultStatusDto) {
    const result = await this.findOne(id)
    if (!result) {
      throw new NotFoundException(' Not Found !')
    }
    const object = Object.assign(result, statusDto)
    return await this.repo.save(object)
  }
}
