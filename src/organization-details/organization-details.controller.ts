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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { PermissionAction, UserRole } from 'src/enum';
import {
  CreateBranchDto,
  CreateOrganizationDetailDto,
  UpdateOrganizationDetailDto,
} from './dto/organization-detail.dto';
import { PaginationDto, PaginationDtoWithDate } from './dto/pagination.dto';
import { OrganizationDetailsService } from './organization-details.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, deleteFileHandler, uploadFileHandler } from 'src/utils/fileUpload.utils';

@Controller('organization-details')
export class OrganizationDetailsController {
  constructor(
    private readonly organizationDetailsService: OrganizationDetailsService,
  ) {}

  @Post('branch')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'organization_detail'])
  create(@Body() dto: CreateBranchDto, @CurrentUser() user: Account) {
    dto.updatedId = user.id;
    // dto.organizationId = dto.accountId;
    return this.organizationDetailsService.createBranch(dto);
  }

  @Post('main/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'organization_detail'])
  mainById(@Body() dto: CreateOrganizationDetailDto, @Param('id') id: string) {
    dto.updatedId = id;
    return this.organizationDetailsService.createMain(dto);
  }

  @Post('main')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'organization_detail'])
  main(@Body() dto: CreateOrganizationDetailDto, @CurrentUser() user: Account) {
    dto.updatedId = user.id;
    return this.organizationDetailsService.createMain(dto);
  }

  @Get('branches/:organizationId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findBranches(
    @Query() query: PaginationDto,
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationDetailsService.findBranches(organizationId, query);
  }

  // Find All School Who Created By
  @Get('by-creator')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllByCreator(
    @Query() query: PaginationDto,
    @CurrentUser() user: Account,
  ) {
    return this.organizationDetailsService.findAllByCreator(user.id, query);
  }

  // Find All School Who Created By
  @Get('by-creator/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllByCreatorId(@Query() query: PaginationDto, @Param('id') id: string) {
    return this.organizationDetailsService.findAllByCreator(id, query);
  }


  @Get("list/:type/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  allListByCreator(
    @Param("type") type: UserRole,
    @Param("accountId") accountId: string,
    @Query() query: CommonPaginationDto
  ) {
    console.log(accountId);
    return this.organizationDetailsService.findListByCreator(type, query, accountId);
  }

  // SCHOOL, COLLEGE, ORGANIZATION
  @Get('list/:type')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  allList(@Param('type') type: UserRole, @Query() query: CommonPaginationDto) {
    return this.organizationDetailsService.findList(type, query);
  }

  // Find All My School Who Logged in
  @Get('my-schools')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllMySchool(@Query() query: PaginationDto, @CurrentUser() user: Account) {
    return this.organizationDetailsService.findAllMySchool(user.id, query);
  }

  // Find All Branches
  @Get('my-schools/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllBranches(
    @Query() query: PaginationDto,
    @Param('accountId') accountId: string,
  ) {
    return this.organizationDetailsService.findAllMySchool(accountId, query);
  }

  // Find All School For Root Admin Staff
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAll(@Query() query: PaginationDto) {
    return this.organizationDetailsService.findAll(query);
  }

  @Get('dashboard/:all')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllByDash(
    @Query() query: PaginationDtoWithDate,
    @Param('all') all: string,
  ) {
    return this.organizationDetailsService.findAllByDashboard(query, all);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  profile(@CurrentUser() user: Account) {
    return this.organizationDetailsService.profile(user.id);
  }

  @Get('profile/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  profileById(@Param('id') id: string) {
    return this.organizationDetailsService.profile(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findOne(@Param('id') id: string) {
    return this.organizationDetailsService.profileById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'organization_detail'])
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDetailDto) {
    delete dto.accountId;
    delete dto.settingId;
    return this.organizationDetailsService.update(id, dto);
  }

  @Put('profile/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'staff_detail'])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async imageUpdate(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const fileData = await this.organizationDetailsService.findOne(id);
    if (fileData.imageName) {
      await deleteFileHandler(fileData.imageName);
    }
    const fileName = 'organization/profile/' + Date.now() + '.webp';
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        'File not uploaded. Try after some time!',
      );
    }
    return this.organizationDetailsService.image(fileName, fileData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'organization_detail'])
  status(@Param('id') id: string, @Body() status: DefaultStatusDto) {
    return this.organizationDetailsService.status(id, status);
  }
}
