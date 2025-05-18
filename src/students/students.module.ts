import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { ClassDiv } from '../class-div/entities/class-div.entity';
import { ClassList } from '../class-list/entities/class-list.entity';
import { BackgroundProcessorService } from './background.service';
import { Student } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { HouseZone } from '../house-zones/entities/house-zone.entity';
import { OrganizationDetailsModule } from '../organization-details/organization-details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Account, ClassList, ClassDiv, HouseZone]),
    AuthModule,
    OrganizationDetailsModule,
    MulterModule.register(),
    BullModule.registerQueue({
      name: 'create-student-queue',
    }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, BackgroundProcessorService],
})
export class StudentsModule {}
