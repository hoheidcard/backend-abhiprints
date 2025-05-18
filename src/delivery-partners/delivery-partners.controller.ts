import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckPermissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DefaultStatusDto } from '../common/dto/default-status.dto';
import { PermissionAction, UserRole } from '../enum';
import { DeliveryPartnersService } from './delivery-partners.service';
import { DeliveryPartnerDto } from './dto/delivery-partner.dto';

@Controller('delivery-partners')
export class DeliveryPartnersController {
  constructor(
    private readonly deliveryPartnersService: DeliveryPartnersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, 'delivery_partner'])
  create(@Body() dto: DeliveryPartnerDto) {
    return this.deliveryPartnersService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, 'delivery_partner'])
  findAll() {
    return this.deliveryPartnersService.findAll();
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, 'delivery_partner'])
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.deliveryPartnersService.status(id, dto);
  }
}
