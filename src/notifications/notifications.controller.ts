import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { NotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('bulk')
  @Roles(...Object.values(UserRole))
  async bulk(@Body() body: NotificationDto) {
    const res = await this.notificationsService.sendBulkNotification(
      body.desc,
      body.title,
      '/topics/all',
      false,
    );
    if (res && res.success == 1) {
      return this.notificationsService.create({
        title: body.title,
        desc: body.desc,
        type: body.type,
        accountId: null,
      });
    } else {
      throw new NotAcceptableException('Try after some time!');
    }
  }

  @Post('single')
  @Roles(...Object.values(UserRole))
  async single(@Body() body: NotificationDto) {
    const res = await this.notificationsService.sendBulkNotification(
      body.desc,
      body.title,
      body.deviceId,
      false,
    );
    if (res && res.success == 1) {
      return this.notificationsService.create({
        title: body.title,
        desc: body.desc,
        type: body.type,
        accountId: body.accountId,
      });
    } else {
      throw new NotAcceptableException('Try after some time!');
    }
  }

  @Post('multi')
  @Roles(...Object.values(UserRole))
  async multi(@Body() body: NotificationDto) {
    const res = await this.notificationsService.sendBulkNotification(
      body.desc,
      body.title,
      body.deviceId,
      true,
    );
    if (res && res.success == 1) {
      for (const i in body.accountId) {
        await this.notificationsService.create({
          title: body.title,
          desc: body.desc,
          type: body.type,
          accountId: body.accountId[i],
        });
      }
      return 'Success';
    } else {
      throw new NotAcceptableException('Try after some time!');
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.USER)
  findAll(@Query() query, @CurrentUser() user: Account) {
    const limit = query.limit || 10;
    const offset = query.offset || 0;
    return this.notificationsService.findAll(limit, offset, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body('status') status: boolean,
    @CurrentUser() user: Account,
  ) {
    return this.notificationsService.update(+id, user.id, status);
  }
}
