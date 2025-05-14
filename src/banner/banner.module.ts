import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { BannerController } from "./banner.controller";
import { BannerService } from "./banner.service";
import { Banner } from "./entities/banner.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
