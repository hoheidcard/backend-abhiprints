import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Express } from "express";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import * as AdmZip from "adm-zip";
import { lstatSync, readFileSync, rmSync } from "fs";
import { Account } from "src/account/entities/account.entity";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { CheckPermissions } from "src/auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "src/auth/guards/permissions.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "src/common/dto/pagination-with-default-status.dto";
import { DefaultStatus, Gender, PermissionAction, UserRole } from "src/enum";
import { PaginationDtoWithDate } from "src/organization-details/dto/pagination.dto";
import { OrganizationDetailsService } from "src/organization-details/organization-details.service";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "src/utils/fileUpload.utils";
import {
  CreateStaffDetailDto,
  UpdateStaffDetailDto,
} from "./dto/staff-detail.dto";
import { StaffDetailsService } from "./staff-details.service";

@Controller("staff-details")
export class StaffDetailsController {
  constructor(
    private readonly staffDetailsService: StaffDetailsService,
    private readonly organizationDetailService: OrganizationDetailsService
  ) {}

  @Post("multi/:organizationDetailId/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "csv_upload"])
  @UseInterceptors(FileInterceptor("file"))
  async createMulti(
    @Param("organizationDetailId") organizationDetailId: string,
    @Param("settingId") settingId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const org =
      await this.organizationDetailService.findAccount(organizationDetailId);
    let csvFilePath = null;
    const originalName = file.originalname.replace(".zip", "");
    const zip = new AdmZip(file.buffer);
    const uploadFolder = "./uploads/" + Date.now();
    const imageLink = organizationDetailId + "/staff/";
    await zip.extractAllTo(uploadFolder, true);
    zip.getEntries().map(async (entry) => {
      const filePath = `${uploadFolder}/${entry.entryName}`;
      if (entry.entryName.toLowerCase().endsWith(".csv")) {
        csvFilePath = filePath;
      } else {
        const dirFilePath = filePath.replace("./", "");
        if (!lstatSync(dirFilePath).isDirectory()) {
          try {
            const fileStream = await readFileSync(dirFilePath);
            const fileName = entry.entryName.replace(originalName + "/", "");
            const [name, fileExtension] = fileName.split("."); // Split file name and extension
            uploadFileHandler(imageLink + name + ".webp", fileStream);
          } catch (e) {}
        }
      }
    });
    const csvData = await this.readCSVData(
      csvFilePath,
      imageLink,
      settingId,
      organizationDetailId,
      org.accountId
    );
    rmSync(uploadFolder, {
      recursive: true,
      force: true,
    });
    return csvData;
  }

  async readCSVData(
    filePath: string,
    link: string,
    settingId: string,
    organizationDetailId: string,
    updatedId: string
  ): Promise<any> {
    const result = { new: 0, old: 0 };
    const designationList =
      await this.staffDetailsService.findDesignation(settingId);
    return new Promise(async (resolve, reject) => {
      const data: any[] = [];
      const content = readFileSync(filePath, { encoding: "utf-8" });

      // Parse CSV data from buffer
      const lines = content.split("\n");
      const headers = lines[0].split(",");
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const values = await this.parseCsvLine(line);
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index] || null;
            if (header === "Employee Photo Number") {
              rowData["profile"] = values[index]
                ? process.env.HOC_CDN_LINK +
                  link +
                  rowData["Employee Photo Number"] +
                  ".webp"
                : null;
              rowData["profileName"] = values[index]
                ? link + rowData["Employee Photo Number"] + ".webp"
                : null;
            }
          });
          rowData["settingId"] = settingId;
          rowData["employeeId"] = rowData["Employee Id"];
          rowData["photoNumber"] = rowData["Employee Photo Number"];
          rowData["aadharNumber"] = rowData["Aadhar No."];
          rowData["contactNo"] = rowData["Employee Contact No."];
          rowData["altContactNo"] =
            rowData["Spouse Contact No."] || rowData["Father Contact No."];
          rowData["emailId"] = rowData["Employee Email"];
          rowData["address"] = rowData["Employee Address"];
          rowData["name"] = rowData["Employee Name"];
          if (
            rowData["Gender"] == Gender.MALE ||
            rowData["Gender"] == Gender.FEMALE ||
            rowData["Gender"] == Gender.OTHER
          ) {
            rowData["gender"] = rowData["Gender"];
          } else {
            rowData["gender"] = null;
          }
          rowData["spouseName"] = rowData["Spouse Name"];
          rowData["guardianName"] = rowData["Father Name"];
          rowData["guardianContactNo"] = rowData["Father Contact No."];
          rowData["spouseContactNo"] = rowData["Spouse Contact No."];
          rowData["rfidNo"] = rowData["RFID Card No."];
          rowData["dob"] = this.parseDate(rowData["Date of Birth"]);
          rowData["joiningDate"] = this.parseDate(rowData["Date of Joining"]);
          rowData["updatedId"] = updatedId;
          rowData["status"] = DefaultStatus.ACTIVE;
          rowData["designationId"] = null;
          rowData["organizationDetailId"] = organizationDetailId;
          const designation = designationList.find(
            (classItem) => classItem.name === rowData["Employee Designation"]
          );
          if (designation) {
            rowData["designationId"] = designation.id || null;
          }
          const payload = await this.staffDetailsService.createCSV(
            rowData,
            organizationDetailId,
            settingId
          );
          if (payload === "New") {
            result.new = result.new + 1;
          }
          if (payload === "Old") {
            result.old = result.old + 1;
          }

          data.push(rowData);
        }
      }
      resolve(result);
    });
  }

  private parseDate(dateString: string): Date {
    if (!dateString) return null;
    const [day, month, year] = dateString.split(".").map(Number);
    // Months are 0-indexed in JavaScript Date objects, so subtract 1 from the month
    return new Date(year, month - 1, day);
  }

  parseCsvLine(line: string) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  @Post("my-staff")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "staff_detail"])
  createMyStaff(
    @CurrentUser() user: Account,
    @Body() dto: CreateStaffDetailDto
  ) {
    if (
      user.roles === UserRole.PARTNER ||
      user.roles === UserRole.SUB_PARTNER
    ) {
      dto.partnerDetailId = user.partnerDetail[0].id;
    }
    dto.updatedId = user.id;
    dto.settingId = user.settingId;
    return this.staffDetailsService.create(dto);
  }

  @Post(":accountId/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "staff_detail"])
  create(
    @Param("accountId") accountId: string,
    @Param("settingId") settingId: string,
    @Body() dto: CreateStaffDetailDto
  ) {
    dto.updatedId = accountId;
    dto.settingId = settingId;
    return this.staffDetailsService.create(dto);
  }

  // @Get("card-generate/:organizationId/:designationId/:cardStatus")
  // @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  // @Roles(...Object.values(UserRole))
  // @CheckPermissions([PermissionAction.READ, "card_correction"])
  // generateCard(
  //   @Param("organizationId") organizationId: string,
  //   @Param("designationId") designationId: string,
  //   @Param("cardStatus") cardStatus: any,
  // ) {
  //   return this.staffDetailsService.generateCard(organizationId, designationId, cardStatus);
  // }

  @Get("dashboard/:all")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findAllByDash(
    @Query() query: PaginationDtoWithDate,
    @Param("all") all: string
  ) {
    return this.staffDetailsService.findAllByDashboard(query, all);
  }

  @Get("final-card-generate/:organizationId/:designationId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "card_print"])
  finalGenerateCard(
    @Param("organizationId") organizationId: string,
    @Param("designationId") designationId: string,
  ) {
    return this.staffDetailsService.generateFinalCard(organizationId, designationId);
  }

  @Get("profile-final-card-generate/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "card_print"])
  profileFinalGenerateCard(
    @Param("id") id: string,
  ) {
    return this.staffDetailsService.generateProfile(id);
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  getProfile(@CurrentUser() user: Account) {
    return this.staffDetailsService.profile(user.id);
  }

  @Get("my-staff-by-id/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findMyStaffById(
    @Param("id") id: string,
    @Query() dto: DefaultStatusPaginationDto
  ) {
    return this.staffDetailsService.findMyStaff(id, dto);
  }

  @Get("my-staff-list/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findMyStaffList(
    @Param("settingId") settingId: string,
    @Query() dto: DefaultStatusPaginationDto
  ) {
    return this.staffDetailsService.findMyStaffList(settingId, dto);
  }

  @Get("my-staff")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findMyStaff(
    @CurrentUser() user: Account,
    @Query() dto: DefaultStatusPaginationDto
  ) {
    return this.staffDetailsService.findMyStaff(user.id, dto);
  }

  // type = ORGANIZATION || PARTNER
  // id is either organizationDetailId || partnerDetailId
  @Get("staff/:id/:type")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findStaff(
    @Param("id") id: string,
    @Param("type") type: string,
    @Query() dto: DefaultStatusPaginationDto
  ) {
    return this.staffDetailsService.findStaff(id, type, dto);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findAllStaff(@Query() dto: CommonPaginationDto) {
    return this.staffDetailsService.findAll(dto);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  findOne(@Param("id") id: string) {
    return this.staffDetailsService.profile(id);
  }

  @Patch()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "staff_detail"])
  updateProfile(
    @CurrentUser() user: Account,
    @Body() dto: UpdateStaffDetailDto
  ) {
    dto.updatedId = user.id;
    return this.staffDetailsService.update(user.id, dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "staff_detail"])
  updateProfileById(
    @Param("id") id: string,
    @CurrentUser() user: Account,
    @Body() dto: UpdateStaffDetailDto
  ) {
    dto.updatedId = user.id;
    return this.staffDetailsService.update(id, dto);
  }

  @Put("status/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "staff_detail"])
  status(
    @Param("id") id: string,
    @CurrentUser() user: Account,
    @Body() dto: DefaultStatusDto
  ) {
    return this.staffDetailsService.status(id, dto);
  }

  @Put("profile/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async imageUpdate(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: string
  ) {
    const fileData = await this.staffDetailsService.findOne(id);
    if (fileData.profileName) {
      await deleteFileHandler(fileData.profileName);
    }
    const photoNumber = "A" + Date.now().toString();
    const fileName = "staff/profile/" + photoNumber + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    return this.staffDetailsService.image(fileName, fileData, photoNumber);
  }
}
