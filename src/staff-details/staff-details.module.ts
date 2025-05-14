import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/account/entities/account.entity";
import { AuthModule } from "src/auth/auth.module";
import { ClassListModule } from "src/class-list/class-list.module";
import { Designation } from "src/designation/entities/designation.entity";
import { Menu } from "src/menus/entities/menu.entity";
import { MenusModule } from "src/menus/menus.module";
import { OrganizationDetailsModule } from "src/organization-details/organization-details.module";
import { PermissionsModule } from "src/permissions/permissions.module";
import { UserPermissionsModule } from "src/user-permissions/user-permissions.module";
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
