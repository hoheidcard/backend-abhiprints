import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StaffSubject } from './entities/staff-subject.entity';
import { StaffSubjectController } from './staff-subject.controller';
import { StaffSubjectService } from './staff-subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffSubject]), AuthModule],
  controllers: [StaffSubjectController],
  providers: [StaffSubjectService],
})
export class StaffSubjectModule {}
