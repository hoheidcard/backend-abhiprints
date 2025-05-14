import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DefaultSettingPermissionController } from './default-setting-permission.controller';
import { DefaultSettingPermissionService } from './default-setting-permission.service';
import { DefaultSettingPermission } from './entities/default-setting-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultSettingPermission]), AuthModule],
  controllers: [DefaultSettingPermissionController],
  providers: [DefaultSettingPermissionService],
})
export class DefaultSettingPermissionModule {}
