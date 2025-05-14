import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BookCategory } from 'src/book-category/entities/book-category.entity';
import { ClassDiv } from 'src/class-div/entities/class-div.entity';
import { ClassList } from 'src/class-list/entities/class-list.entity';
import { DefaultSetting } from 'src/default-settings/entities/default-setting.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Designation } from 'src/designation/entities/designation.entity';
import { HouseZone } from 'src/house-zones/entities/house-zone.entity';
import { Menu } from 'src/menus/entities/menu.entity';
import { MenusModule } from 'src/menus/menus.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Setting } from 'src/settings/entities/setting.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { UserPermissionsModule } from 'src/user-permissions/user-permissions.module';
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
