import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateNewsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(0)
    @MaxLength(200)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(0)
    @MaxLength(5000)
    desc: string;
}
