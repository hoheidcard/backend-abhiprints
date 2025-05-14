import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/pagination-with-default-status.dto';
import { PermissionAction, UserRole } from 'src/enum';
import { FaqAnswerDto, FaqDto } from './dto/faq.dto';
import { UpdateStatus } from './dto/update-faq.dto';
import { FaqsService } from './faqs.service';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() dto: FaqDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.faqsService.create(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'faq'])
  findAll(@Query() dto: DefaultStatusPaginationDto) {
    return this.faqsService.findAll(dto);
  }

  @Get()
  @CacheKey('faq-list')
  @CacheTTL(1000000)
  find(@Query() dto: CommonPaginationDto) {
    return this.faqsService.find(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ROOT, UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.UPDATE, 'faq'])
  update(
    @Param('id') id: string,
    @Body() dto: FaqAnswerDto,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.faqsService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ROOT, UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.UPDATE, 'faq'])
  status(
    @Param('id') id: string,
    @Body() dto: UpdateStatus,
    @CurrentUser() user: Account,
  ) {
    dto.updatedId = user.id;
    return this.faqsService.status(id, dto);
  }
}
