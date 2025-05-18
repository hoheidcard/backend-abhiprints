import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DefaultService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async countDashboard(fDate: string, tDate: string) {
    const fromDate = new Date(fDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(tDate);
    toDate.setHours(23, 59, 59, 59);

    const accountCount = await this.accountRepo
      .createQueryBuilder('account')
      .select(['account.roles as roles', 'COUNT(*) AS count'])
      .where(
        'account.createdAt >= :fromDate AND account.createdAt <= :toDate',
        {
          fromDate: fromDate,
          toDate: toDate,
        },
      )
      .groupBy('account.roles')
      .getRawOne();

    return { accountCount };
  }
}
