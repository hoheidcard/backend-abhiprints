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
import { Express } from 'express'; // 
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CommonPaginationDto } from '../common/dto/common-pagination.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { PermissionAction, UserRole } from '../enum';
import {
  CreateBranchDto,
  CreateOrganizationDetailDto,
  UpdateOrganizationDetailDto,
} from './dto/organization-detail.dto';
import { PaginationDto, PaginationDtoWithDate } from './dto/pagination.dto';
import { OrganizationDetailsService } from './organization-details.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, deleteFileHandler, uploadFileHandler } from '../utils/fileUpload.utils';

@Controller('organization-details')
export class OrganizationDetailsController {
  constructor(
    private readonly organizationDetailsService: OrganizationDetailsService,
  ) {}

  @Post('branch')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'organization_detail'])
  create(@Body() dto: CreateBranchDto, @CurrentUser() user: Account) {
    dto.updatedId = user.id;
    // dto.organizationId = dto.accountId;
    return this.organizationDetailsService.createBranch(dto);
  }

  @Post('main/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'organization_detail'])
  mainById(@Body() dto: CreateOrganizationDetailDto, @Param('id') id: string) {
    dto.updatedId = id;
    return this.organizationDetailsService.createMain(dto);
  }

  @Post('main')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'organization_detail'])
  main(@Body() dto: CreateOrganizationDetailDto, @CurrentUser() user: Account) {
    dto.updatedId = user.id;
    return this.organizationDetailsService.createMain(dto);
  }

  @Get('branches/:organizationId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
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
  @Roles(...(Object.values(UserRole) as string[]))
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
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllByCreatorId(@Query() query: PaginationDto, @Param('id') id: string) {
    return this.organizationDetailsService.findAllByCreator(id, query);
  }


  @Get("list/:type/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
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
  @Roles(...(Object.values(UserRole) as string[]))
  allList(@Param('type') type: UserRole, @Query() query: CommonPaginationDto) {
    return this.organizationDetailsService.findList(type, query);
  }

  // Find All My School Who Logged in
  @Get('my-schools')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllMySchool(@Query() query: PaginationDto, @CurrentUser() user: Account) {
    return this.organizationDetailsService.findAllMySchool(user.id, query);
  }

  // Find All Branches
  @Get('my-schools/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
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
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAll(@Query() query: PaginationDto) {
    return this.organizationDetailsService.findAll(query);
  }

  @Get('dashboard/:all')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findAllByDash(
    @Query() query: PaginationDtoWithDate,
    @Param('all') all: string,
  ) {
    return this.organizationDetailsService.findAllByDashboard(query, all);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  profile(@CurrentUser() user: Account) {
    return this.organizationDetailsService.profile(user.id);
  }

  @Get('profile/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  profileById(@Param('id') id: string) {
    return this.organizationDetailsService.profile(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'organization_detail'])
  findOne(@Param('id') id: string) {
    return this.organizationDetailsService.profileById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'organization_detail'])
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDetailDto) {
    delete dto.accountId;
    delete dto.settingId;
    return this.organizationDetailsService.update(id, dto);
  }

  @Put('profile/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'staff_detail'])
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
  )
  async imageUpdate(
     @UploadedFile() file: Express.Multer.File,  // <-- Change the type here
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
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'organization_detail'])
  status(@Param('id') id: string, @Body() status: DefaultStatusDto) {
    return this.organizationDetailsService.status(id, status);
  }
}
