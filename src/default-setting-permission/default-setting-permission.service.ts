import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSettingPermissionDto,
  UpdateSettingPermissionDto,
} from './dto/create-default-setting-permission.dto';
import { DefaultSettingPermission } from './entities/default-setting-permission.entity';

@Injectable()
export class DefaultSettingPermissionService {
  constructor(
    @InjectRepository(DefaultSettingPermission)
    private readonly repo: Repository<DefaultSettingPermission>,
  ) {}

  async create(dto: CreateSettingPermissionDto[]) {
    return this.repo.save(dto);
  }

  async update(dto: UpdateSettingPermissionDto[]) {
    try {
      return this.repo.save(dto);
    } catch (error) {
      throw new NotAcceptableException(
        'Something bad happened! Try after some time!',
      );
    }
  }
}
