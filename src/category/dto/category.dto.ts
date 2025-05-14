import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(10000)
  desc: string;
}
