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
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DefaultSettingFor, DefaultSettingType, UserRole } from '../enum';
import { DefaultSettingsService } from './default-settings.service';
import {
  BulkDefaultSettingDto,
  CreateDefaultSettingDto,
  UpdateDefaultSettingDto,
} from './dto/default-setting.dto';

@Controller('default-settings')
export class DefaultSettingsController {
  constructor(
    private readonly defaultSettingsService: DefaultSettingsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  create(@Body() dto: CreateDefaultSettingDto) {
    return this.defaultSettingsService.create(dto);
  }

  @Get(':settingType/:settingFor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findAll(
    @Param('settingType') settingType: DefaultSettingType,
    @Param('settingFor') settingFor: DefaultSettingFor,
  ) {
    return this.defaultSettingsService.findAll(settingType, settingFor);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  update(@Param('id') id: string, @Body() dto: UpdateDefaultSettingDto) {
    return this.defaultSettingsService.update(+id, dto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  findOne(@Body() dto: BulkDefaultSettingDto[]) {
    return this.defaultSettingsService.updatePriority(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  remove(@Param('id') id: string) {
    return this.defaultSettingsService.remove(+id);
  }
}
