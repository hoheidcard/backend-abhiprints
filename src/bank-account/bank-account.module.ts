import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { BankAccount } from './entities/bank-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount]), AuthModule],
  controllers: [BankAccountController],
  providers: [BankAccountService],
})
export class BankAccountModule {}
