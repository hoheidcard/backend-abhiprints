import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from './entities/login-history.entity';

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectRepository(LoginHistory)
    private readonly repo: Repository<LoginHistory>,
  ) {}

  async findAll(limit: number, offset: number, accountId: string) {
    const [result, total] = await this.repo.findAndCount({
      where: { accountId },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return { result, total };
  }
}
