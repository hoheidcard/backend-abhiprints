import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, MinLength, MaxLength, Matches, IsString, IsEmail, IsEnum, IsOptional, IsDate } from "class-validator";
import { Match } from "src/auth/decorators/match.decorator";
import { Gender, UserRole } from "src/enum";


export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  emailId: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob: Date;

  @IsNotEmpty()
  @IsEnum(UserRole)
  roles: UserRole;
}



export class PasswordWithOldDto {
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}

export class PasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}
