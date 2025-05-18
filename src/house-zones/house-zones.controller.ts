import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { HouseZonesService } from './house-zones.service';
import { CreateHouseZoneDto } from './dto/create-house-zone.dto';
import { UpdateHouseZoneDto } from './dto/update-house-zone.dto';
import { Account } from '../account/entities/account.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DefaultStatusPaginationDto } from '../common/dto/pagination-with-default-status.dto';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole, PermissionAction } from '../enum';
import { EditorDesignDto } from '../id-cards-stock/dto/card-design.dto';
import { ProductDto } from '../class-list/dto/class-list.dto';

@Controller('house-zones')
export class HouseZonesController {
  constructor(private readonly houseZonesService: HouseZonesService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'house_zone'])
  create(@Body() dto: CreateHouseZoneDto, @CurrentUser() user: Account) {
    dto.accountId = user.id
    dto.updatedId = user.id
    dto.settingId = user.settingId
    return this.houseZonesService.create(dto);
  }

  @Post(':settingId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'house_zone'])
  createByAdmin(@Param('settingId') settingId: string, @Body() dto: CreateHouseZoneDto, @CurrentUser() user: Account) {
    dto.accountId = user.id
    dto.updatedId = user.id
    dto.settingId = settingId
    return this.houseZonesService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'house_zone'])
  findAll(@Query() query: DefaultStatusPaginationDto, @CurrentUser() user: Account) {
    return this.houseZonesService.findAll(user.id,user.settingId, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'house_zone'])
  findOne(@Param('id') id: string) {
    return this.houseZonesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'house_zone'])
  update(@Param('id') id: string, @Body() updateHouseZoneDto: UpdateHouseZoneDto) {
    return this.houseZonesService.update(id, updateHouseZoneDto);
  }

  @Put("editor/:id/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "id_cards_stock"])
  updateCard(@Param("id") id: string, @Param("settingId") settingId: string, @Body() dto: EditorDesignDto) {
    return this.houseZonesService.updateEditor(id, settingId, dto);
  }

  @Put("products")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "designation"])
  product(@Body() dto: ProductDto[]) {
    return this.houseZonesService.products(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'department'])
  status(@Param('id') id: string, statusDto: DefaultStatusDto) {
    return this.houseZonesService.status(id, statusDto);
  }
}
