import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { Gender } from "src/enum";

export class CreateStaffDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  emailId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  dob: Date;

  @ApiProperty()
  @IsOptional()
  joiningDate: Date;

  @IsOptional()
  cast: string;

  @IsOptional()
  religion: string;

  @IsNotEmpty()
  @IsMobilePhone("en-IN")
  contactNo: string;

  @IsOptional()
  nationality: string;

  @IsOptional()
  address: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  pincode: string;

  @IsOptional()
  spouseName: string;

  @IsOptional()
  spouseContactNo: string;

  @IsOptional()
  spouseOccupation: string;

  @IsOptional()
  spouseIncome: string;

  // @IsOptional()
  // guardianRelation: string

  @IsOptional()
  guardianName: string;

  @IsOptional()
  @IsMobilePhone("en-IN")
  guardianContactNo: string;

  @IsOptional()
  guardianOccupation: string;

  @IsOptional()
  guardianIncome: string;

  @IsNotEmpty()
  @IsUUID()
  designationId: string;

  // @IsOptional()
  // @IsEnum(YNStatus)
  // transport:YNStatus

  // @IsOptional()
  // @IsEnum(YNStatus)
  // canteen:YNStatus

  // @IsOptional()
  // @IsEnum(YNStatus)
  // library:YNStatus

  // @IsOptional()
  // @IsEnum(YNStatus)
  // hostel:YNStatus

  @IsOptional()
  accountId: string;

  @IsOptional()
  organizationDetailId: string;

  @IsOptional()
  partnerDetailId: string;

  @IsOptional()
  updatedId: string;

  @IsOptional()
  settingId: string;
}

export class UpdateStaffDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  emailId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  dob: Date;

  @IsOptional()
  @IsUUID()
  designationId: string;

  @IsOptional()
  nationality: string;

  @IsOptional()
  address: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  pincode: string;

  @IsOptional()
  spouseName: string;

  @IsOptional()
  spouseContactNo: string;

  @IsOptional()
  spouseOccupation: string;

  @IsOptional()
  spouseIncome: string;

  @IsOptional()
  guardianName: string;

  @IsOptional()
  @IsMobilePhone("en-IN")
  guardianContactNo: string;

  @IsOptional()
  guardianOccupation: string;

  @IsOptional()
  guardianIncome: string;

  @IsOptional()
  accountId: string;

  @IsOptional()
  updatedId: string;
}
