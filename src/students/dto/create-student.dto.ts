import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender, Stream, YNStatus } from '../../enum';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  regNo: string;

  @IsOptional()
  studentNo: string;

  @IsOptional()
  UID: string;

  @IsOptional()
  PEN: string;

  @IsOptional()
  admissionNo: string;

  @IsOptional()
  rollNo: number;

  @IsOptional()
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
  @IsEnum(YNStatus)
  transport: YNStatus;

  @IsOptional()
  @IsEnum(Stream)
  stream: Stream;

  @IsOptional()
  @IsEnum(YNStatus)
  canteen: YNStatus;

  @IsOptional()
  @IsEnum(YNStatus)
  library: YNStatus;

  @IsOptional()
  @IsEnum(YNStatus)
  hostel: YNStatus;

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

export class StudentCardDto {
  id: string;
  card: number;
}

export class PromoteClassDto {
  id: string;
  classListId: string;
}
