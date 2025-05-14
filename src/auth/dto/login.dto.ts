import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/enum';

export class MobLoginDto {
  @IsNotEmpty()
  loginId: string;

  @IsOptional()
  deviceId: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  loginId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;
}

export class OtpDto {
  @IsNotEmpty()
  loginId: string; 

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  otp: number;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;
}

export class SigninDto {
  @IsNotEmpty()
  loginId: string;

  @IsOptional()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  passwordStatus: boolean;
}

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  emailId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  type: UserRole;
}
