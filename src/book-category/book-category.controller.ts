import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CommonPaginationDto } from '../common/dto/common-pagination.dto';
import { PermissionAction, UserRole } from '../enum';
import { BookCategoryService } from './book-category.service';
import { BookCategoryDto } from './dto/book-category.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';

@Controller('book-category')
export class BookCategoryController {
  constructor(private readonly bookCategoryService: BookCategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'book_category'])
  create(@Body() dto: BookCategoryDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.bookCategoryService.create(dto);
  }

  @Post(':settingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'book_category'])
  createByAdmin(@Param('settingId') id: string, @Body() dto: BookCategoryDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.updatedId = user.id;
    dto.settingId = id;
    return this.bookCategoryService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'book_category'])
  findAll(@Query() query: CommonPaginationDto) {
    return this.bookCategoryService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'book_category'])
  findOne(@Param('id') id: string) {
    return this.bookCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'book_category'])
  update(
    @Param('id') id: string,
    @Body() dto: BookCategoryDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.bookCategoryService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'book_category'])
  remove(@Param('id') id: string,@Body() dto:DefaultStatusDto) {
    return this.bookCategoryService.status(id,dto);
  }
}
