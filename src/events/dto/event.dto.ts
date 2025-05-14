import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
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
} from "class-validator";
import { EventFor, EventLowerFor } from "src/enum";

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
  offset: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsNotEmpty()
  @IsEnum(EventFor)
  eventFor: EventFor;

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
}

export class EventIdDto {
  @IsOptional()
  @IsUUID()
  organizationDetailId: string;

  @IsOptional()
  @IsUUID()
  partnerDetailId: string;

  // only for backend use
  @IsOptional()
  eventId: string;
}

export class EventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000000)
  desc: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  fromTime: Date;

  @IsNotEmpty()
  // @Type(() => Date)
  // @IsDate()
  toTime: Date;

  @IsNotEmpty()
  @IsEnum(EventFor)
  eventFor: EventFor;

  @IsOptional()
  @IsEnum(EventLowerFor)
  type: EventLowerFor;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  all: boolean;

  @IsOptional()
  @IsArray()
  eventIds: EventIdDto[];

  // only for backend use
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
