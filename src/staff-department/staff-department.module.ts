import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StaffDepartment } from './entities/staff-department.entity';
import { StaffDepartmentController } from './staff-department.controller';
import { StaffDepartmentService } from './staff-department.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffDepartment]), AuthModule],
  controllers: [StaffDepartmentController],
  providers: [StaffDepartmentService],
})
export class StaffDepartmentModule {}
