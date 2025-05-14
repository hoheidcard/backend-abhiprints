import { Type } from "class-transformer";
import { IsDate, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { Gender, YNStatus } from "src/enum";

export class CreateCSVStudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  regNo: number;

  @IsNotEmpty()
  studentNo: string;

  @IsNotEmpty()
  admissionNo: string;

  @IsNotEmpty()
  rollNo: number;

  @IsNotEmpty()
  rfidNo: string;

  @IsOptional()
  emailId: string;

  @IsOptional()
  cast: string;

  @IsOptional()
  religion: string;

  @IsOptional()
  nationality: string;

  @IsOptional()
  contactNo: string;

  @IsOptional()
  address: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  pincode: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsOptional()
  @MaxLength(40)
  @MinLength(5)
  fatherName: string;

  @IsOptional()
  @IsMobilePhone('en-IN')
  fatherContactNo: string;

  @IsOptional()
  fatherOccupation: string;

  @IsOptional()
  fatherIncome: string;

  @IsOptional()
  motherName: string;

  @IsOptional()
  @IsMobilePhone('en-IN')
  motherContactNo: string;

  @IsOptional()
  motherOccupation: string;

  @IsOptional()
  motherIncome: string;

  @IsOptional()
  @IsUUID()
  houseZoneId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationDetailId: string;

  @IsOptional()
  @IsUUID()
  classDivId: string;

  @IsNotEmpty()
  @IsUUID()
  classListId: string;

  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  updatedId: string;

  @IsNotEmpty()
  @IsUUID()
  settingId: string;
}
