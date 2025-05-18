import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DeliveryPartnersController } from './delivery-partners.controller';
import { DeliveryPartnersService } from './delivery-partners.service';
import { DeliveryPartner } from './entities/delivery-partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryPartner]), AuthModule],
  controllers: [DeliveryPartnersController],
  providers: [DeliveryPartnersService],
})
export class DeliveryPartnersModule {}
