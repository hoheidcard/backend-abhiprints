import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateDesignationPermissionDto,
  UpdateDesignationPermissionDto,
} from './dto/designation-permission.dto';
import { DesignationPermission } from './entities/designation-permission.entity';

@Injectable()
export class DesignationPermissionService {
  constructor(
    @InjectRepository(DesignationPermission)
    private readonly repo: Repository<DesignationPermission>,
  ) {}

  async create(dto: CreateDesignationPermissionDto[]) {
    return this.repo.save(dto);
  }

  async update(dto: UpdateDesignationPermissionDto[]) {
    try {
      return this.repo.save(dto);
    } catch (error) {
      throw new NotAcceptableException(
        'Something bad happened! Try after some time!',
      );
    }
  }
}
