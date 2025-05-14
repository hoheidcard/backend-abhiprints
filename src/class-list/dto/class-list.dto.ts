import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TeacherType } from 'src/enum';

export class ClassListDto {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(50)
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

export class ClassListDivDto {
  @IsOptional()
  @IsUUID()
  classListId: string;

  @IsOptional()
  @IsUUID()
  classDivId: string;

  @IsOptional()
  @IsUUID()
  staffDetailId: string;

  @IsOptional()
  @IsUUID()
  coOrdinatorId: string;

  @IsOptional()
  time_start: Date;

  @IsOptional()
  time_end: Date;

  @IsOptional()
  @IsEnum(TeacherType)
  type: TeacherType;

  @IsOptional()
  @IsUUID()
  subjectId: string;
}

export class ProductDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  idCardsStockId: string;

  @IsOptional()
  card: string;
}

export class PProductDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  pIdCardsStockId: string;

  @IsOptional()
  pcard: string;
}
