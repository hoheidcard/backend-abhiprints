import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "src/common/dto/pagination-with-default-status.dto";
import { PermissionAction, UserRole } from "src/enum";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "src/utils/fileUpload.utils";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";
import { Express } from 'express';  // or import 'express' globally if needed

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "category"])
  create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get("all")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "category"])
  findAll(@Query() dto: DefaultStatusPaginationDto) {
    return this.categoryService.findAll(dto);
  }

  @Get()
  findByUser(@Query() dto: CommonPaginationDto) {
    return this.categoryService.find(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "category"])
  update(@Param("id") id: string, @Body() dto: CategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Put("status/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "category"])
  status(@Param("id") id: string, @Body() dto: DefaultStatusDto) {
    return this.categoryService.status(id, dto);
  }

  @Put("image/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async imageUpdate(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: string
  ) {
    const fileData = await this.categoryService.findOne(id);
    if (fileData.imageName) {
      await deleteFileHandler(fileData.imageName);
    }
    const fileName = "product/category/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.categoryService.image(fileName, fileData);
  }
}
