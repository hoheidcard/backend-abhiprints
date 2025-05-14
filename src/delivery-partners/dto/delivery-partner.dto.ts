import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class DeliveryPartnerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  title: string;
}
