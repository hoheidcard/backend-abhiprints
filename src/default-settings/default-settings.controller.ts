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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DefaultSettingFor, DefaultSettingType, UserRole } from 'src/enum';
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
  @Roles(...Object.values(UserRole))
  create(@Body() dto: CreateDefaultSettingDto) {
    return this.defaultSettingsService.create(dto);
  }

  @Get(':settingType/:settingFor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  findAll(
    @Param('settingType') settingType: DefaultSettingType,
    @Param('settingFor') settingFor: DefaultSettingFor,
  ) {
    return this.defaultSettingsService.findAll(settingType, settingFor);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  update(@Param('id') id: string, @Body() dto: UpdateDefaultSettingDto) {
    return this.defaultSettingsService.update(+id, dto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  findOne(@Body() dto: BulkDefaultSettingDto[]) {
    return this.defaultSettingsService.updatePriority(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  remove(@Param('id') id: string) {
    return this.defaultSettingsService.remove(+id);
  }
}
