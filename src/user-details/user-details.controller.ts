import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
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
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserRole } from "src/enum";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "src/utils/fileUpload.utils";
import { UpdateUserDetailDto } from "./dto/update-user-details";
import { UserDetailDto } from "./dto/user-detail.dto";
import { UserDetailsService } from "./user-details.service";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";

@Controller("user-details")
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  create(@Body() dto: UserDetailDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.userDetailsService.create(dto);
  }

  @Get()
  findByUser(@Query() dto: CommonPaginationDto) {
    return this.userDetailsService.findByUser(dto);
  }

  @Patch("profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  update(@Body() dto: UpdateUserDetailDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.userDetailsService.update(dto, user.id);
  }

  @Put("profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async image(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Account
  ) {
    const fileData = await this.userDetailsService.findOne(user.id);
    if (fileData.profileName) {
      await deleteFileHandler(fileData.profileName);
    }
    const fileName = "profile/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.userDetailsService.profileImage(fileName, fileData);
  }
}
