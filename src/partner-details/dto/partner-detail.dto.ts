import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartnerType, SMType, UserRole } from 'src/enum';

export class PartnerDetailDto {
  @IsNotEmpty()
  @IsEnum(SMType)
  singleMultiType: SMType;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(20)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firmName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firmEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  ownerName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  ownerEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  ownerMobile: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  ownerWhatsApp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  natureOfBusiness: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @MinLength(0)
  @MaxLength(200)
  website: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(200)
  gstDetail: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(250)
  firmShort: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  firmAddress: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  city: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  pincode: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;

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
