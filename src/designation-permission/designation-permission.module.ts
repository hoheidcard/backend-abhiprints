import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DesignationPermissionController } from './designation-permission.controller';
import { DesignationPermissionService } from './designation-permission.service';
import { DesignationPermission } from './entities/designation-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DesignationPermission]), AuthModule],
  controllers: [DesignationPermissionController],
  providers: [DesignationPermissionService],
})
export class DesignationPermissionModule {}
