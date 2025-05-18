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
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CommonPaginationDto } from '../common/dto/common-pagination.dto';
import { BankStatus, PermissionAction, UserRole } from '../enum';
import { BankAccountService } from './bank-account.service';
import { ActiveDto, BankDto, PaginationSDto } from './dto/bank-account.dto';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  create(@Body() dto: BankDto, @CurrentUser() user: Account) {
    if(!dto.accountId){
      dto.accountId = user.id;
    }
    return this.bankAccountService.create(dto);
  }

  @Get('list/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.READ, 'bank_account'])
  findAll(@Query() query: PaginationSDto) {
    return this.bankAccountService.findAll(
      query.limit,
      query.offset,
      query.status,
    );
  }

  @Get('list/my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findMy(@Query() query: CommonPaginationDto, @CurrentUser() user: Account) {
    return this.bankAccountService.findAllByUser(
      user.id,
      query.limit,
      query.offset,
    );
  }

  @Get('list/my/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findByUser(@Query() query: CommonPaginationDto, @Param('id') id: string) {
    return this.bankAccountService.findAllByUser(id, query.limit, query.offset);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findOne(@Param('id') id: string) {
    return this.bankAccountService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  update(
    @Param('id') id: string,
    @Body() dto: BankDto,
    @CurrentUser() user: Account,
  ) {
    return this.bankAccountService.update(id, dto, user.roles);
  }

  @Put('activate/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  activateStatus(
    @Param('id') id: string,
    @Body() dto: ActiveDto,
    @CurrentUser() user: Account,
  ) {
    return this.bankAccountService.activeStatus(id, user.id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.UPDATE, 'bank_account'])
  status(@Param('id') id: string, @Body() dto: BankStatus) {
    return this.bankAccountService.status(id, dto);
  }
}
