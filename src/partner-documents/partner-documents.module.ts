import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PartnerDocument } from './entities/partner-document.entity';
import { PartnerDocumentsController } from './partner-documents.controller';
import { PartnerDocumentsService } from './partner-documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerDocument]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [PartnerDocumentsController],
  providers: [PartnerDocumentsService],
})
export class PartnerDocumentsModule {}
