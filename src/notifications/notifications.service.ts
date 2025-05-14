import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    private readonly httpService: HttpService,
  ) {}

  async sendBulkNotification(body, title, token, status) {
    const header = {
      headers: {
        'cache-control': 'no-cache',
        authorization:
          'key=AAAAqKmoPwY:APA91bEuJpsVMvfhzcwPbXUV3B6Wu6kQl8iA6738dXuvdMHSELGZegyGLc90uP0LqTSGkzMv08ULzE29_lDsvJTSUr2BH2Flk-w2',
        'content-type': 'application/json',
      },
    };
    let data = null;
    if (status) {
      data = JSON.stringify({
        registration_ids: token,
        data: { body: body, title: title, sound: 'default', type: 1 },
        notification: { body: body, title: title, sound: 'default', type: 1 },
      });
    } else {
      data = JSON.stringify({
        to: token,
        data: { body: body, title: title, sound: 'default', type: 1 },
        notification: { body: body, title: title, sound: 'default', type: 1 },
      });
    }

    try {
      const result = await this.httpService.axiosRef.post(
        `https://fcm.googleapis.com/fcm/send`,
        data,
        header,
      );
      if (result.data) {
        return result.data;
      }
    } catch (error) {
      return false;
    }
  }

  async create(createDto) {
    const result = await this.repo.count({
      where: {
        title: createDto.title,
        desc: createDto.desc,
        type: createDto.type,
        accountId: createDto.accountId,
      },
    });

    if (!result) {
      return this.repo.save(createDto);
    } else {
      return true;
    }
  }

  async findAll(limit: number, offset: number, accountId: string) {
    const [result, total] = await this.repo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.account', 'account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .where(
        'notification.accountId = :accountId OR notification.accountId IS NULL',
        {
          accountId: accountId,
        },
      )
      .skip(offset)
      .take(limit)
      .orderBy({ 'notification.createdAt': 'DESC' })
      .getManyAndCount();
    return { result, total };
  }

  async update(id: number, accountId: string, status: boolean) {
    const notifs = await this.repo.findOne({ where: { id, accountId } });
    if (!notifs) {
      throw new NotFoundException('Notification not found!');
    }
    const obj = Object.assign(notifs, { read: status });
    return this.repo.save(obj);
  }
}
