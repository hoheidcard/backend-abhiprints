import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BookDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(250)
  shortDesc: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  author: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @IsNotEmpty()
  @IsUUID()
  bookCategoryId: string;

  @IsOptional()
  @IsUUID()
  classListId: string;

  @IsOptional()
  @IsUUID()
  organizationDetailId: string;

  // for backend use only
  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  updatedId: string;

  @IsOptional()
  @IsUUID()
  settingId: string;

  @IsOptional()
  image: string;

  @IsOptional()
  imageName: string;
}
