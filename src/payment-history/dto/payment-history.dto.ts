import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PaymentStatus, PaymentType } from 'src/enum';

export class PaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;
}

export class PaymentCODDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  paymentId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  gst: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  total: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentType)
  mode: PaymentType;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @IsOptional()
  accountId: string;
}

export class PaymentHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  gst: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  total: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentType)
  mode: PaymentType;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  cartId: string;

  @IsOptional()
  accountId: string;

  @IsOptional()
  invoiceNumber: string;
}

export class PayDto {
  @ApiProperty()
  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  paymentId: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(0)
  @MaxLength(500)
  summary: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  updatedId: string;
}

export class PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(50)
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @ApiProperty()
  @IsOptional()
  keyword: string;

  @ApiProperty()
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty()
  @IsNotEmpty()
  toDate: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentType)
  type: PaymentType;
}
