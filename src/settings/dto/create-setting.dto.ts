import { IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {}
export class UpdateSettingDto {
  @IsOptional()
  @IsString()
  csvFields: string;

  @IsOptional()
  @IsString()
  staffCsvFields: string;
}

