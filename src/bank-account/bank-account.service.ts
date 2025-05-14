import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankStatus, UserRole } from 'src/enum';
import { Repository } from 'typeorm';
import { ActiveDto, BankDto } from './dto/bank-account.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly repo: Repository<BankAccount>,
  ) {}

  async create(dto: BankDto) {
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(limit: number, offset: number, status: BankStatus) {
    const [result, total] = await this.repo
      .createQueryBuilder('bankAccount')
      .where('bankAccount.status = :status', { status: status })
      .take(limit)
      .skip(offset)
      .orderBy({ 'bankAccount.createdAt': 'DESC' })
      .getManyAndCount();

    return { result, total };
  }

  async findAllByUser(accountId: string, limit: number, offset: number) {
    const [result, total] = await this.repo
      .createQueryBuilder('bankAccount')
      .where('bankAccount.accountId = :accountId', { accountId: accountId })
      .take(limit)
      .skip(offset)
      .orderBy({ 'bankAccount.createdAt': 'DESC' })
      .getManyAndCount();

    return { result, total };
  }

  async findOne(id: string) {
    const bankAccount = await this.repo.findOne({ where: { accountId: id } });
    if (!bankAccount) {
      throw new NotFoundException('Bank account not found!');
    }
    return bankAccount;
  }

  async update(id: string, dto: BankDto, role: UserRole) {
    const bankAccount = await this.repo.findOne({ where: { id } });
    if (!bankAccount) {
      throw new NotFoundException('Bank account not found!');
    }
    const obj = Object.assign(bankAccount, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: BankStatus) {
    const menu = await this.repo.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException('Bank account not found!');
    }
    const obj = Object.assign(menu, dto);
    return this.repo.save(obj);
  }

  async activeStatus(id: string, accountId: string, dto: ActiveDto) {
    const menu = await this.repo.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException('Bank account not found!');
    }
    this.repo
      .createQueryBuilder()
      .update()
      .set({ active: false })
      .where('accountId = :accountId', {
        accountId: accountId,
      })
      .execute();

    const obj = Object.assign(menu, dto);
    return this.repo.save(obj);
  }
}
