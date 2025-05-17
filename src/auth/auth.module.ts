import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../account/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { LoginHistory } from '../login-history/entities/login-history.entity';
import { UserPermission } from '../user-permissions/entities/user-permission.entity';
import { CaslAbilityFactory } from './factory/casl-ability.factory';
import { PermissionsGuard } from './guards/permissions.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserDetail } from '../user-details/entities/user-detail.entity';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([Account, LoginHistory, UserPermission, UserDetail]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: process.env.HOC_JWT_SECRET,
          signOptions: {
            expiresIn: process.env.HOC_JWT_EXPIRE,
          },
        };
      },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CaslAbilityFactory, PermissionsGuard],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
    JwtModule,
    CaslAbilityFactory,
    PermissionsGuard,
  ],
})
export class AuthModule {}
