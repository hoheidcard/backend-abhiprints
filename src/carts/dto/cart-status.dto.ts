import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CartStatus, PaymentType } from 'src/enum';

export class StatusDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(20)
  cgst: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(20)
  sgst: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(20)
  igst: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100000)
  shipping: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100000)
  addDiscount: number;

  @IsNotEmpty()
  @IsEnum(CartStatus)
  status: CartStatus;
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PaymentType)
  mode: PaymentType;
}

export class CancelOrderDto {
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  reason: string;
}

export class ReturnOrderDto {
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  reason: string;

  @IsNotEmpty()
  pickupDate: Date;
}
