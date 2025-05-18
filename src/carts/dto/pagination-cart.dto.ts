import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CartStatus, PaymentStatus, PaymentType } from '../../enum';

export class PaginationDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsNotEmpty()
  @IsEnum(CartStatus)
  status: CartStatus;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentMode: PaymentType;

  @IsNotEmpty()
  fromDate: string;

  @IsNotEmpty()
  toDate: string;
}
