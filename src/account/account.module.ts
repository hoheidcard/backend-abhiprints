import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import { MenusModule } from 'src/menus/menus.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UserPermissionsModule } from 'src/user-permissions/user-permissions.module';
import { Setting } from 'src/settings/entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, StaffDetail, Setting]),
    AuthModule,
    MenusModule,
    PermissionsModule,
    UserPermissionsModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule { }
