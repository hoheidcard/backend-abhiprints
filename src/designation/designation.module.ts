import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DesignationController } from './designation.controller';
import { DesignationService } from './designation.service';
import { Designation } from './entities/designation.entity';
import { IdCardsStock } from '../id-cards-stock/entities/id-cards-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Designation, IdCardsStock]), AuthModule],
  controllers: [DesignationController],
  providers: [DesignationService],
  exports: [DesignationService],
})
export class DesignationModule {}
