import { Injectable } from "@nestjs/common";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class NotifyService {
  constructor(private readonly notficationService: NotificationsService) {}
}
