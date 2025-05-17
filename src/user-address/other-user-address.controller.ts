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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AddressDto } from "./dto/user-address.dto";
import { UserAddressService } from "./user-address.service";

@Controller("other-user-address")
export class OtherUserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post(":accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Roles(UserRole.USER)
  create(@Body() dto: AddressDto, @Param("accountId") accountId: string) {
    dto.accountId = accountId;
    return this.userAddressService.create(dto);
  }

  @Get(":accountId")
  // @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Roles(UserRole.USER)
  findOne(@Param("accountId") accountId: string) {
    return this.userAddressService.findOne(accountId);
  }

  @Patch(":id/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Roles(UserRole.USER)
  update(
    @Param("id") id: string,
    @Body() dto: AddressDto,
    @Param("accountId") accountId: string
  ) {
    dto.accountId = accountId;
    return this.userAddressService.update(id, dto);
  }

  @Put(":id/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Roles(UserRole.USER)
  defaultAddress(
    @Param("id") id: string,
    @Param("accountId") accountId: string
  ) {
    return this.userAddressService.defaultAddress(id, accountId);
  }

  @Delete(":id/:accountId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  // @Roles(UserRole.USER)
  remove(@Param("id") id: string, @Param("accountId") accountId: string) {
    return this.userAddressService.remove(id, accountId);
  }
}
