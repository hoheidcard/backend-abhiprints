import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Account } from "../account/entities/account.entity";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CheckPermissions } from "../auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PermissionAction, UserRole } from "../enum";
import { DatePaginationDto } from "../common/dto/pagination-with-date.dto";
import { StudentAttendanceDto } from "./dto/student-attendance.dto";
import { StudentAttendanceService } from "./student-attendance.service";

@Controller("student-attendance")
export class StudentAttendanceController {
  constructor(
    private readonly studentAttendanceService: StudentAttendanceService
  ) {}

  @Post(":organizationDetailId/:subjectId/:classListId/:classDivId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, "student_attendance"])
  create(
    @Body() dto: StudentAttendanceDto[],
    @CurrentUser() user: Account,
    @Param("organizationDetailId") organizationDetailId: string,
    @Param("subjectId") subjectId: string,
    @Param("classListId") classListId: string,
    @Param("classDivId") classDivId: string
  ) {
    dto.forEach((element) => {
      element.accountId = user.id;
      element.updatedId = user.id;
      element.classListId = classListId;
      element.organizationDetailId = organizationDetailId;
      element.settingId = user.settingId;
      element.subjectId =
        subjectId == "null" || subjectId == null || !subjectId
          ? null
          : subjectId;
      element.classDivId =
        classDivId == "null" || classDivId == null || !classDivId
          ? null
          : classDivId;
    });
    return this.studentAttendanceService.create(dto);
  }

  @Get(":studentid")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "student_attendance"])
  async findAll(
    @Param("studentid") studentid: string,
    @Query() dto: DatePaginationDto
  ) {
    return this.studentAttendanceService.findAll(studentid, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, "student_attendance"])
  remove(@Param("id") id: string) {
    return this.studentAttendanceService.remove(id);
  }
}
