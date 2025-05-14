import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { Blog } from "./entities/blog.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    AuthModule,
    MulterModule.register(),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
