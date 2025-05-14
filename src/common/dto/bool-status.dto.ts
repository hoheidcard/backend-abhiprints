import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class BoolStatusDto {
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  status: boolean;
}
