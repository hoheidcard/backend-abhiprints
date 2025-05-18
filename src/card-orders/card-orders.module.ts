import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { OrganizationDetail } from '../organization-details/entities/organization-detail.entity';
import { Student } from '../students/entities/student.entity';
import { CardOrdersController } from './card-orders.controller';
import { CardOrdersService } from './card-orders.service';
import { CardOrderList } from './entities/card-order-list.entity';
import { CardOrder } from './entities/card-order.entity';
import { CardStudent } from './entities/card-students.entity';
import { StaffDetail } from '../staff-details/entities/staff-detail.entity';
import { Setting } from '../settings/entities/setting.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardOrder,
      CardOrderList,
      OrganizationDetail,
      Account,
      Student,
      CardStudent,
      StaffDetail,
      Setting,
      Notification
    ]),
    AuthModule,
  ],
  controllers: [CardOrdersController],
  providers: [CardOrdersService],
})
export class CardOrdersModule {}
