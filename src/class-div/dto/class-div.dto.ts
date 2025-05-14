import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ClassDivDto {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(30)
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  updatedId: string;

  @IsOptional()
  @IsUUID()
  settingId: string;
}
