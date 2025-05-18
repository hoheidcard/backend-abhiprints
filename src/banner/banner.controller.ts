import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Express } from "express";

import { CheckPermissions } from "../auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusPaginationDto } from "../common/dto/pagination-with-default-status.dto";
import { BannerType, PermissionAction, UserRole } from "../enum";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "../../src/utils/fileUpload.utils";
import { BannerService } from "./banner.service";
import { BannerDto } from "./dto/create-banner.dto";

@Controller("banner")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post(":type/:date")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, "banner"])
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),       // Important: use memoryStorage to have file.buffer
      fileFilter: imageFileFilter,
    })
  )
  async create(
    @UploadedFile() file: Express.Multer.File,  // Use Express.Multer.File to have buffer property
    @Param("type") type: BannerType,
    @Param("date") date: string
  ) {
    const fileName = "banners/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.bannerService.create(type, date, fileName);
  }

  @Get("admin")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "banner"])
  findAll(@Query() dto: DefaultStatusPaginationDto) {
    return this.bannerService.findAll(dto);
  }

  @Get()
  findByUser(@Query() dto: CommonPaginationDto) {
    return this.bannerService.findByUser(dto);
  }

  @Put("image/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "banner"])
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),     // Important for file.buffer here too
      fileFilter: imageFileFilter,
    })
  )
  async imageUpdate(
    @UploadedFile() file: Express.Multer.File,  // Use Express.Multer.File here too
    @Param("id") id: string
  ) {
    const fileData = await this.bannerService.findOne(id);
    if (fileData.imageName) {
      await deleteFileHandler(fileData.imageName);
    }
    const fileName = "banners/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.bannerService.image(fileName, fileData);
  }

  @Put("status/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "banner"])
  status(@Param("id") id: string, @Body() dto: BannerDto) {
    return this.bannerService.status(id, dto);
  }
}
