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
import { Express } from 'express'; // Add this import at the top

import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { PermissionAction, UserRole } from "src/enum";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "src/utils/fileUpload.utils";
import { PaginationDto, PaginationDtoWithDate } from "./dto/pagination.dto";
import { PartnerDetailDto } from "./dto/partner-detail.dto";
import { PartnerDetailsService } from "./partner-details.service";

@Controller("partner-details")
export class PartnerDetailsController {
  constructor(private readonly partnerDetailsService: PartnerDetailsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "partner_detail"])
  main(@Body() dto: PartnerDetailDto, @CurrentUser() user: Account) {
    dto.updatedId = user.id;
    return this.partnerDetailsService.createMain(dto);
  }

  @Post("user")
  
  userMain(@Body() dto: PartnerDetailDto) {
    return this.partnerDetailsService.createMainEnquiry(dto);
  }

  @Post("sub-partner/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "partner_detail"])
  subPartner(
    @Param("accountId") accountId: string,
    @Body() dto: PartnerDetailDto
  ) {
    dto.updatedId = accountId;
    dto.accountId = accountId;
    return this.partnerDetailsService.createMain(dto);
  }

  // Find All School Who Created By
  @Get("by-creator")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "partner_detail"])
  findAllByCreator(
    @Query() query: PaginationDto,
    @CurrentUser() user: Account
  ) {
    return this.partnerDetailsService.findAllByCreator(user.id, query);
  }

  @Get("by-creator/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "partner_detail"])
  findAllByCreatorById(@Query() query: PaginationDto, @Param("id") id: string) {
    return this.partnerDetailsService.findAllByCreator(id, query);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "partner_detail"])
  findAll(@Query() query: PaginationDto) {
    return this.partnerDetailsService.findAll(query);
  }

  @Get("dashboard/:all")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "partner_detail"])
  findAllByDash(
    @Query() query: PaginationDtoWithDate,
    @Param("all") all: string
  ) {
    return this.partnerDetailsService.findAllbyDashboard(query, all);
  }


  // PARTNER, SUB PARTNER
  @Get("list/:type/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  allListByCreator(
    @Param("type") type: UserRole,
    @Param("accountId") accountId: string,
    @Query() query: CommonPaginationDto
  ) {
    return this.partnerDetailsService.findListByCreator(type, query, accountId);
  }

  // PARTNER, SUB PARTNER
  @Get("list/:type")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  allList(@Param("type") type: UserRole, @Query() query: CommonPaginationDto) {
    return this.partnerDetailsService.findList(type, query);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  profile(@CurrentUser() user: Account) {
    return this.partnerDetailsService.profile(user.id);
  }

  @Get("profile/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  profileById(@Param("id") id: string) {
    return this.partnerDetailsService.profile(id);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "partner_detail"])
  findOne(@Param("id") id: string) {
    return this.partnerDetailsService.profile(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "partner_detail"])
  update(@Param("id") id: string, @Body() dto: PartnerDetailDto) {
    return this.partnerDetailsService.update(id, dto);
  }

  @Put("profile/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "staff_detail"])
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async imageUpdate(
     @UploadedFile() file: Express.Multer.File,  // <-- Change the type here
    @Param("id") id: string
  ) {
    const fileData = await this.partnerDetailsService.findOne(id);
    if (fileData.logoName) {
      await deleteFileHandler(fileData.logoName);
    }
    const fileName = "partners/profile/" + Date.now() + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.partnerDetailsService.image(fileName, fileData);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "partner_detail"])
  status(@Param("id") id: string, @Body() status: DefaultStatusDto) {
    return this.partnerDetailsService.status(id, status);
  }
}
