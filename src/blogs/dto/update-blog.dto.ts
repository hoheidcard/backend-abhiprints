import { IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  title: string;

  @IsOptional()
  author: string;

  @IsOptional()
  desc: string;

  @IsOptional()
  date: Date;
}
