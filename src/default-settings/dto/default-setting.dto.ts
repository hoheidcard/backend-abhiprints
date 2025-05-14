import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { DefaultSettingFor, DefaultSettingType } from 'src/enum';

export class CreateDefaultSettingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priority: number;

  @IsNotEmpty()
  @IsEnum(DefaultSettingType)
  type: DefaultSettingType;

  @IsNotEmpty()
  @IsEnum(DefaultSettingFor)
  for: DefaultSettingFor;
}

export class UpdateDefaultSettingDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priority: number;
}

export class BulkDefaultSettingDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  priority: number;
}
