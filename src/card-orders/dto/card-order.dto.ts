import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsNumber,
  MinLength,
  Min,
} from "class-validator";
import { OrderStatus } from "src/enum";

export class CreateCardOrderDto {}

export class ORderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ClassListDto {
  @IsNotEmpty()
  @IsUUID()
  classListId: string;
}

export class StudentCardOrderDto {
  @IsNotEmpty()
  @IsArray()
  classes: any[]; //[id1,id2,id3]

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  parentCard: boolean;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qty: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(250)
  deliveryAddress: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  contactNumber: string;

  @IsOptional()
  @IsUUID()
  deliveryPartnerId: string;

  // Only for backend use

  @IsOptional()
  @IsUUID()
  staffAccountId: string;

  @IsOptional()
  @IsUUID()
  settingId: string;
}

export class StaffDetailIDDto {
  @IsNotEmpty()
  @IsUUID()
  staffDetailId: string;
}

export class StaffCardOrderDto {
  @IsNotEmpty()
  @IsArray()
  staff: any[]; //[id1,id2,id3]

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qty: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(250)
  deliveryAddress: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  contactNumber: string;

  @IsOptional()
  @IsUUID()
  deliveryPartnerId: string;

  // Only for backend use
  @IsOptional()
  @IsUUID()
  staffAccountId: string;

  @IsOptional()
  @IsUUID()
  settingId: string;
}
