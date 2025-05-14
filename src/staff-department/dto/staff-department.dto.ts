import { IsNotEmpty, IsOptional } from 'class-validator';

export class StaffDepartmentDto {
  @IsNotEmpty()
  departmentId: string;

  @IsNotEmpty()
  staffDetailId: string;

  @IsOptional()
  accountId: string;
}
