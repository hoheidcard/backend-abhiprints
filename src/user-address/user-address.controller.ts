import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { AddressDto } from './dto/user-address.dto';
import { UserAddressService } from './user-address.service';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  create(@Body() dto: AddressDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.userAddressService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  findOne(@CurrentUser() user: Account) {
    return this.userAddressService.findOne(user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  update(
    @Param('id') id: string,
    @Body() dto: AddressDto,
    @CurrentUser() user: Account,
  ) {
    dto.accountId = user.id;
    return this.userAddressService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  defaultAddress(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.userAddressService.defaultAddress(id, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  remove(@Param('id') id: string, @CurrentUser() user: Account) {
    return this.userAddressService.remove(id, user.id);
  }
}
