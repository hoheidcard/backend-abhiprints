import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DefaultSettingsController } from './default-settings.controller';
import { DefaultSettingsService } from './default-settings.service';
import { DefaultSetting } from './entities/default-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DefaultSetting]), AuthModule],
  controllers: [DefaultSettingsController],
  providers: [DefaultSettingsService],
})
export class DefaultSettingsModule {}
