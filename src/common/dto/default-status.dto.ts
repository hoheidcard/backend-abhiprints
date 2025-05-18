import { IsEnum, IsNotEmpty } from 'class-validator';
import { DefaultStatus } from '../../enum';

export class DefaultStatusDto {
  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}
