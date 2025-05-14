import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notice } from './entities/notice.entity';
import { NoticesController } from './notices.controller';
import { NoticesService } from './notices.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notice]), AuthModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
