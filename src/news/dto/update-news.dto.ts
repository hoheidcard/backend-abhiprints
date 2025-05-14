import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateNewsDto {
    @IsOptional()
    @IsString()
    @MinLength(0)
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    @MinLength(0)
    @MaxLength(5000)
    desc: string;
}
