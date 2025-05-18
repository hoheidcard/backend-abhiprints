import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { BookCategory } from '../book-category/entities/book-category.entity';
import { ClassDiv } from '../class-div/entities/class-div.entity';
import { ClassList } from '../class-list/entities/class-list.entity';
import { DefaultSetting } from '../default-settings/entities/default-setting.entity';
import { Department } from '../departments/entities/department.entity';
import { Designation } from '../designation/entities/designation.entity';
import { HouseZone } from '../house-zones/entities/house-zone.entity';
import { Menu } from '../menus/entities/menu.entity';
import { MenusModule } from '../menus/menus.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { Setting } from '../settings/entities/setting.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { UserPermissionsModule } from '../user-permissions/user-permissions.module';
import { OrganizationDetail } from './entities/organization-detail.entity';
import { OrganizationDetailsController } from './organization-details.controller';
import { OrganizationDetailsService } from './organization-details.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationDetail,
      Account,
      Setting,

      DefaultSetting,
      Department,
      Designation,
      BookCategory,
      ClassDiv,
      ClassList,
      HouseZone,
      Subject,

      Menu,
    ]),
    AuthModule,
    MenusModule,
    PermissionsModule,
    UserPermissionsModule,
    MulterModule.register()
  ],
  controllers: [OrganizationDetailsController],
  providers: [OrganizationDetailsService],
  exports: [OrganizationDetailsService],
})
export class OrganizationDetailsModule {}
