import {
  Controller,
  Delete,
  NotAcceptableException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { CheckPermissions } from "../auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PermissionAction, ProductFileType, UserRole } from "../enum";
import { imageFileFilter, uploadFileHandler } from "../utils/fileUpload.utils";
import { ProductImagesService } from "./product-images.service";

@Controller("product-images")
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post(":idCardsStock/:type")
  // @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  // @Roles(...(Object.values(UserRole) as string[]))
  // @CheckPermissions([PermissionAction.CREATE, "product_image"])
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async profileImage(
    @Param("idCardsStock") idCardsStock: string,
    @Param("type") type: ProductFileType,
    @UploadedFile() file: Express.Multer.File
  ) {
    const files = await this.productImagesService.find(idCardsStock);
    if (files > 4) {
      throw new NotAcceptableException("Only 5 images allowed!");
    }
    const fileName = "products/images/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.productImagesService.create(idCardsStock, fileName, type);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, "product_image"])
  async remove(@Param("id") id: string) {
    return this.productImagesService.remove(id);
  }
}
