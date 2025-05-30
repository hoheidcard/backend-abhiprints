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
import { PermissionAction, UserRole } from '../enum';
import { FeedbackDto, PaginationDto, StatusDto } from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  create(@Body() dto: FeedbackDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.feedbackService.create(dto);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ROOT, UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.UPDATE, 'feedback'])
  findAll(@Query() dto: PaginationDto) {
    return this.feedbackService.findAll(dto);
  }

  @Get()
  find() {
    return this.feedbackService.find();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ROOT, UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.UPDATE, 'feedback'])
  update(@Param('id') id: string, @Body() dto: FeedbackDto) {
    return this.feedbackService.update(id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ROOT, UserRole.ADMIN, UserRole.STAFF)
  @CheckPermissions([PermissionAction.UPDATE, 'feedback'])
  status(@Param('id') id: string, @Body() dto: StatusDto) {
    return this.feedbackService.status(id, dto);
  }
}
