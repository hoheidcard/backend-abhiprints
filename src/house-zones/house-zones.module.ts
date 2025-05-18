import { Module } from '@nestjs/common';
import { HouseZonesService } from './house-zones.service';
import { HouseZonesController } from './house-zones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseZone } from './entities/house-zone.entity';
import { AuthModule } from '../auth/auth.module';
import { IdCardsStock } from '../id-cards-stock/entities/id-cards-stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HouseZone, IdCardsStock]), AuthModule],
  controllers: [HouseZonesController],
  providers: [HouseZonesService],
})
export class HouseZonesModule {}
