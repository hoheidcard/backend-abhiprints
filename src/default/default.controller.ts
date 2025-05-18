import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../enum';
import { DefaultService } from './default.service';

@Controller('default')
export class DefaultController {
  constructor(private readonly defaultService: DefaultService) {}

  @Get('count/:fromDate/:toDate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  dashboardCount(
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    return this.defaultService.countDashboard(fromDate, toDate);
  }
}
