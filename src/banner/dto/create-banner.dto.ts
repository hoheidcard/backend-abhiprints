import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { BannerType, DefaultStatus } from 'src/enum';

export class CreateBannerDto {}
export class BannerDto {
  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  @IsOptional()
  @IsEnum(BannerType)
  type: BannerType;

  @IsOptional()
  endDate: Date;
}
