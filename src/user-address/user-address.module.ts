import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserAddress } from './entities/user-address.entity';
import { UserAddressController } from './user-address.controller';
import { UserAddressService } from './user-address.service';
import { OtherUserAddressController } from './other-user-address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress]), AuthModule],
  controllers: [UserAddressController, OtherUserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
