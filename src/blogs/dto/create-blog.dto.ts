import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(55)
  author: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  desc: string;

  @IsOptional()
  date: Date;

  @IsOptional()
  accountId: string;
}
