import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { DefaultStatus, UserRole } from "src/enum";

export class PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  offset: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  // COLLEGE, SCHOOL, ORGANIZATION, PARTNER
  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;
}

export class PaginationDtoWithDate {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fromDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  toDate: string;

  // COLLEGE, SCHOOL, ORGANIZATION, PARTNER
  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;
}
