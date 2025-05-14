import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { EventOrganizationsModule } from "src/event-organizations/event-organizations.module";
import { OrganizationDetailsModule } from "src/organization-details/organization-details.module";
import { PartnerDetailsModule } from "src/partner-details/partner-details.module";
import { Event } from "./entities/event.entity";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    AuthModule,
    OrganizationDetailsModule,
    PartnerDetailsModule,
    EventOrganizationsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
