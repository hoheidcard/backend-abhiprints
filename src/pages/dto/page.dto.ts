import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class PageDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50000)
  desc: string;
}
