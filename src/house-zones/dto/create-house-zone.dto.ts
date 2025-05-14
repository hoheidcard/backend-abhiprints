import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateHouseZoneDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

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
