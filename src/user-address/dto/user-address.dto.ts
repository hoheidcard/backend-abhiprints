import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  address: string;

  @IsOptional()
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  phone: string;

  @ApiProperty()
  @IsOptional()
  altPhone: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(10)
  pincode: string;
}