import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { DefaultService } from './default.service';

@Controller('default')
export class DefaultController {
  constructor(private readonly defaultService: DefaultService) {}

  @Get('count/:fromDate/:toDate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  dashboardCount(
    @Param('fromDate') fromDate: string,
    @Param('toDate') toDate: string,
  ) {
    return this.defaultService.countDashboard(fromDate, toDate);
  }
}
