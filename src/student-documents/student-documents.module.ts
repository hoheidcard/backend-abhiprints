import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StudentDocumentsController } from './student-documents.controller';
import { StudentDocumentsService } from './student-documents.service';
import { StudentDocument } from './entities/student-document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentDocument]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [StudentDocumentsController],
  providers: [StudentDocumentsService],
})
export class StudentDocumentsModule {}
