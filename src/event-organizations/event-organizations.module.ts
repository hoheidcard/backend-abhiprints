import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EventOrganization } from './entities/event-organization.entity';
import { EventOrganizationsController } from './event-organizations.controller';
import { EventOrganizationsService } from './event-organizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventOrganization]), AuthModule],
  controllers: [EventOrganizationsController],
  providers: [EventOrganizationsService],
  exports: [EventOrganizationsService],
})
export class EventOrganizationsModule {}
