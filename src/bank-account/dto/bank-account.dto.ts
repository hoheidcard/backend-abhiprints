import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BankStatus } from 'src/enum';

export class BankDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  bankName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  branchName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  holderName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-9]{9,18}$/, { message: 'Invalid account number!' })
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]{4}\d{7}$/, { message: 'Invalid IFSC code!' })
  ifsc: string;

  @IsOptional()
  accountId: string;
}

export class StatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(BankStatus)
  status: BankStatus;
}

export class ActiveDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}

export class PaginationSDto {
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
  @IsNotEmpty()
  @IsEnum(BankStatus)
  status: BankStatus;
}
