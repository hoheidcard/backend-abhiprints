import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { StaffDocument } from './entities/staff-document.entity';
import { StaffDocumentsController } from './staff-documents.controller';
import { StaffDocumentsService } from './staff-documents.service';
import { StaffDetailsModule } from '../staff-details/staff-details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffDocument]),
    AuthModule,
    MulterModule.register(),
    StaffDetailsModule,
  ],
  controllers: [StaffDocumentsController],
  providers: [StaffDocumentsService],
})
export class StaffDocumentsModule {}
