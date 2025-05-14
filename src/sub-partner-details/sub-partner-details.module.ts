import { Module } from '@nestjs/common';
import { SubPartnerDetailsService } from './sub-partner-details.service';
import { SubPartnerDetailsController } from './sub-partner-details.controller';

@Module({
  controllers: [SubPartnerDetailsController],
  providers: [SubPartnerDetailsService],
})
export class SubPartnerDetailsModule {}
