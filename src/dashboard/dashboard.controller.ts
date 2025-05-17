import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "src/enum";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("count/:fromDate/:toDate/:all")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  dashboardCount(
    @Param("fromDate") fromDate: string,
    @Param("toDate") toDate: string,
    @Param("all") all: string
  ) {
    return this.dashboardService.countDashboard(fromDate, toDate, all);
  }

  @Get("organization/count/:settingId/:organizationId/:fromDate/:toDate/:all")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  organizationCount(
    @Param("fromDate") fromDate: string,
    @Param("toDate") toDate: string,
    @Param("settingId") settingId: string,
    @Param("all") all: string,
    @Param("organizationId") organizationId: string
  ) {
    return this.dashboardService.countOrganizationDashboard(
      settingId,
      organizationId,
      fromDate,
      toDate,
      all
    );
  }

  @Get("partner/:partnerAccountId/:partnerDetailId/:fromDate/:toDate/:all")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  partnerCount(
    @Param("fromDate") fromDate: string,
    @Param("toDate") toDate: string,
    @Param("partnerAccountId") partnerAccountId: string,
    @Param("all") all: string,
    @Param("partnerDetailId") partnerDetailId: string
  ) {
    return this.dashboardService.countPartnerDashboard(
      partnerDetailId,
      partnerAccountId,
      fromDate,
      toDate,
      all
    );
  }
}
