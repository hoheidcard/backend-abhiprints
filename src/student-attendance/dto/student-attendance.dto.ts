import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { AttendanceStatus } from 'src/enum';

export class StudentAttendanceDto {
  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  // Only for backend use
  @IsOptional()
  @IsUUID()
  subjectId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationDetailId: string;

  @IsOptional()
  @IsUUID()
  classListId: string;

  @IsOptional()
  @IsUUID()
  classDivId: string;

  @IsOptional()
  date: Date;

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
