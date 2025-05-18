import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { DefaultStatus } from '../../enum';
import { CreateFaqDto } from './create-faq.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDto) {}

export class UpdateStatus {
  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  @IsOptional()
  updatedId: string;
}
