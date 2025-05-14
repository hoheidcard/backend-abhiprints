import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Menu } from 'src/menus/entities/menu.entity';
import { MenusModule } from 'src/menus/menus.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Setting } from 'src/settings/entities/setting.entity';
import { UserPermissionsModule } from 'src/user-permissions/user-permissions.module';
import { PartnerDetail } from './entities/partner-detail.entity';
import { PartnerDetailsController } from './partner-details.controller';
import { PartnerDetailsService } from './partner-details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerDetail, Account, Setting, Menu]),
    AuthModule,
    MenusModule,
    PermissionsModule,
    UserPermissionsModule,
  ],
  controllers: [PartnerDetailsController],
  providers: [PartnerDetailsService],
  exports: [PartnerDetailsService],
})
export class PartnerDetailsModule {}
