import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClassDivController } from './class-div.controller';
import { ClassDivService } from './class-div.service';
import { ClassDiv } from './entities/class-div.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassDiv]), AuthModule],
  controllers: [ClassDivController],
  providers: [ClassDivService],
})
export class ClassDivModule {}
