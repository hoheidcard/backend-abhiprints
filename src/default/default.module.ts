import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { DefaultController } from './default.controller';
import { DefaultService } from './default.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), AuthModule],
  controllers: [DefaultController],
  providers: [DefaultService],
})
export class DefaultModule {}
