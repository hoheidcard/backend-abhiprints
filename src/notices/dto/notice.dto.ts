import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../enum';

export class NoticeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  desc: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  type: UserRole;

  @IsNotEmpty()
  @IsUUID()
  settingId: string;

  @IsNotEmpty()
  @IsUUID()
  organizationDetailId: string;

  // only for backend use
  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  @IsUUID()
  updatedId: string;
}
