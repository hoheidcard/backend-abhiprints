import { IsEnum, IsNotEmpty } from 'class-validator';
import { NotificationType } from '../../enum';

export class NotificationDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  accountId: any;

  deviceId: any;
}
