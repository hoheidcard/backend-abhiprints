import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/enum';

export class UpdateUserDetailDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneNumber: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
  
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(40)
  email: string;

  accountId: string;
}
