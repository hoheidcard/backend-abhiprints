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
import { Express } from 'express'; // Express types include Multer namespace if declared
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "src/common/dto/pagination-with-default-status.dto";
import { PermissionAction, UserRole } from "src/enum";
import { ProductVariantsService } from "src/product-variants/product-variants.service";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "src/utils/fileUpload.utils";
import { EditorDesignDto, ProductDetailDto } from "./dto/card-design.dto";
import { IdCardsStockService } from "./id-cards-stock.service";
 
@Controller("id-cards-stock")
export class IdCardsStockController {
  constructor(
    private readonly idCardsStockService: IdCardsStockService,
    private readonly productVariantService: ProductVariantsService
  ) {}

  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async image(@UploadedFile() file: Express.Multer.File) {
    const fileName = "products/images/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return { image: process.env.HOC_CDN_LINK + fileName, imageName: fileName };
  }

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "id_cards_stock"])
  async create(@Body() dto: ProductDetailDto) {
    const payload = await this.idCardsStockService.create(dto);
    dto.productVariant.forEach((item) => (item.idCardsStockId = payload.id));
    this.productVariantService.create(dto.productVariant);
    return payload;
  }

  @Get("all")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "id_cards_stock"])
  findAll(@Query() dto: DefaultStatusPaginationDto) {
    return this.idCardsStockService.findAll(dto);
  }

  @Get("details/:id/:settingId/:type/:sp")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findDetail(
    @Param("id") id: string,
    @Param("settingId") settingId: string,
    @Param("type") type: string,
    @Param("sp") sp: string
  ) {
    return this.idCardsStockService.findDetail(id, settingId, type, sp);
  }

  @Get("max-details-student/:settingId")
  findMaxDetailStudent(@Param("settingId") settingId: string) {
    return this.idCardsStockService.findMaxDetailStudent(settingId);
  }

  @Get("max-details-staff/:settingId")
  findMaxDetailStaff(@Param("settingId") settingId: string) {
    return this.idCardsStockService.findMaxDetailStaff(settingId);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  find(@Query() dto: CommonPaginationDto) {
    return this.idCardsStockService.find(dto);
  }
  @Get("menu")
  findMenu(@Query() dto: CommonPaginationDto) {
    return this.idCardsStockService.findMenu(dto);
  }

  @Get("user/:categoryId")
  // @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Roles(...Object.values(UserRole))
  findByUser(@Param("categoryId") id :string) {
    console.log(id);
    return this.idCardsStockService.findByCatId(id);
  }

  @Get("details/:id")
  findById(@Param("id") id: string) {
    return this.idCardsStockService.findById(id);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  findOne(@Param("id") id: string) {
    return this.idCardsStockService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  update(@Param("id") id: string, @Body() dto: ProductDetailDto) {
    dto.productVariant.forEach((item) => (item.idCardsStockId = id));
    this.productVariantService.create(dto.productVariant);
    return this.idCardsStockService.update(id, dto);
  }

  @Put("editor/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  updateCard(@Param("id") id: string, @Body() dto: EditorDesignDto) {
    return this.idCardsStockService.updateEditor(id, dto);
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
      @UploadedFile() file: Express.Multer.File,  // <-- Change the type here
    @Param("id") id: string
  ) {
    const fileData = await this.idCardsStockService.findOne(id);
    if (fileData.imageName) {
      await deleteFileHandler(fileData.imageName);
    }
    const fileName = "products/images/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.idCardsStockService.image(fileName, fileData);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  status(@Param("id") id: string, @Body() dto: DefaultStatusDto) {
    return this.idCardsStockService.status(id, dto);
  }
}
