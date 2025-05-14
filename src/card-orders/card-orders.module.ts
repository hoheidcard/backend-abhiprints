import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrganizationDetail } from 'src/organization-details/entities/organization-detail.entity';
import { Student } from 'src/students/entities/student.entity';
import { CardOrdersController } from './card-orders.controller';
import { CardOrdersService } from './card-orders.service';
import { CardOrderList } from './entities/card-order-list.entity';
import { CardOrder } from './entities/card-order.entity';
import { CardStudent } from './entities/card-students.entity';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

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
