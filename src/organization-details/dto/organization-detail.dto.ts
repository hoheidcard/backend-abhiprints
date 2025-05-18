import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BranchType, SMType, UserRole } from '../../enum';

export class CreateOrganizationDetailDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(SMType)
  singleMultiType: SMType;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(250)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(6)
  pincode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  contactNo: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  whatsApp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  ownerName: string;

  @IsNotEmpty()
  @IsEnum(BranchType)
  type: BranchType;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numberOfBranch: number;

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

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  // @MinLength(6)
  // @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(250)
  address: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(6)
  pincode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  contactNo: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  whatsApp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(20)
  ownerName: string;

  @IsNotEmpty()
  @IsEnum(BranchType)
  type: BranchType;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numberOfBranch: number;

  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @IsNotEmpty()
  @IsUUID()
  settingId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId: string;

  // only for backend use
  @IsOptional()
  @IsUUID()
  updatedId: string;
}

export class UpdateOrganizationDetailDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(250)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(6)
  pincode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  contactNo: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  whatsApp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  // @IsString()
  // @MinLength(6)
  // @MaxLength(20)
  ownerName: string;

  @IsNotEmpty()
  @IsEnum(BranchType)
  type: BranchType;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numberOfBranch: number;

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
