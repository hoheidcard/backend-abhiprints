import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../account/entities/account.entity";
import { AuthModule } from "../auth/auth.module";
import { ClassListModule } from "../class-list/class-list.module";
import { Designation } from "../designation/entities/designation.entity";
import { Menu } from "../menus/entities/menu.entity";
import { MenusModule } from "../menus/menus.module";
import { OrganizationDetailsModule } from "../organization-details/organization-details.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserPermissionsModule } from "../user-permissions/user-permissions.module";
import { StaffDetail } from "./entities/staff-detail.entity";
import { StaffDetailsController } from "./staff-details.controller";
import { StaffDetailsService } from "./staff-details.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffDetail, Menu, Account, Designation]),
    AuthModule,
    MulterModule.register(),
    MenusModule,
    PermissionsModule,
    UserPermissionsModule,
    OrganizationDetailsModule,
    ClassListModule,
  ],
  controllers: [StaffDetailsController],
  providers: [StaffDetailsService],
  exports: [StaffDetailsService],
})
export class StaffDetailsModule {}
