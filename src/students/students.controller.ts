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
import { RolesGuard } from "../auth/guards/roles.guard";
import { CommonPaginationDto } from "src/common/dto/common-pagination.dto";
import { DefaultStatusDto } from "src/common/dto/default-status.dto";
import { DefaultStatus, Gender, PermissionAction, UserRole } from "src/enum";
import { PaginationDtoWithDate } from "src/organization-details/dto/pagination.dto";
import { OrganizationDetailsService } from "src/organization-details/organization-details.service";
import {
  deleteFileHandler,
  imageFileFilter,
  uploadFileHandler,
} from "src/utils/fileUpload.utils";
import {
  CreateStudentDto,
  PromoteClassDto,
  StudentCardDto,
} from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentsService } from "./students.service";

@Controller("students")
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly organizationDetailService: OrganizationDetailsService
  ) { }

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
    const imageLink = organizationDetailId + "/students/";
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
            const fileName = await entry.entryName.replace(
              originalName + "/",
              ""
            );
            const [name, fileExtension] = await fileName.split("."); // Split file name and extension
            uploadFileHandler(imageLink + name + ".webp", fileStream);
          } catch (e) { }
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
    const classList = await this.studentsService.findClass(settingId);
    const classDiv = await this.studentsService.findSection(settingId);
    const houseZone = await this.studentsService.findHouseZone(settingId);
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
            if (header === "Student Photo Number") {
              rowData["profile"] = values[index]
                ? process.env.HOC_CDN_LINK +
                link +
                rowData["Student Photo Number"] +
                ".webp"
                : null;
              rowData["profileName"] = values[index]
                ? link + rowData["Student Photo Number"] + ".webp"
                : null;
            }
            if (header === "Father Photo Number") {
              rowData["fatherImage"] = values[index]
                ? process.env.HOC_CDN_LINK +
                link +
                rowData["Father Photo Number"] +
                ".webp"
                : null;
              rowData["fatherImageName"] = values[index]
                ? link + rowData["Father Photo Number"] + ".webp"
                : null;
            }
            if (header === "Mother Photo Number") {
              rowData["motherImage"] = values[index]
                ? process.env.HOC_CDN_LINK +
                link +
                rowData["Mother Photo Number"] +
                ".webp"
                : null;
              rowData["motherImageName"] = values[index]
                ? link + rowData["Mother Photo Number"] + ".webp"
                : null;
            }
            if (header === "Guardian Photo Number") {
              rowData["guardianImage"] = values[index]
                ? process.env.HOC_CDN_LINK +
                link +
                rowData["Guardian Photo Number"] +
                ".webp"
                : null;
              rowData["guardianImageName"] = values[index]
                ? link + rowData["Guardian Photo Number"] + ".webp"
                : null;
            }
          });
          rowData["settingId"] = settingId;
          rowData["regNo"] = rowData["Reg. No."];
          rowData["srNo"] = rowData["SR. No."] ? +rowData["SR. No."] : null;
          rowData["photoNumber"] = rowData["Student Photo Number"];
          rowData["admissionNo"] = rowData["Admission No."];
          rowData["rollNo"] = rowData["Roll No."];
          rowData["aadharNumber"] = rowData["Aadhar No."];
          rowData["name"] = rowData["Student Name"];
          rowData["fatherName"] = rowData["Father Name"];
          rowData["motherName"] = rowData["Mother Name"];
          rowData["UID"] = rowData["Unique ID"];
          rowData["PEN"] = rowData["Permanent Education Number"];
          rowData["guardianName"] = rowData["Guardian Name"];
          rowData["contactNo"] = rowData["Student Contact No."];
          rowData["altContactNo"] = rowData["Father Contact No."];
          rowData["fatherContactNo"] = rowData["Father Contact No."];
          rowData["motherContactNo"] = rowData["Mother Contact No."];
          rowData["guardianContactNo"] = rowData["Guardian Contact No."];
          // rowData[''] = rowData['Student Whatsapp No.'];
          // rowData[''] = rowData['Father Whatsapp No.'];
          // rowData[''] = rowData['Mother Whatsapp No.'];
          // rowData[''] = rowData['Guardian Whatsapp No.'];
          rowData["guardianRelation"] = rowData["Guardian Relationship"];
          rowData["bloodGroup"] = rowData["Blood Group"];
          rowData["emailId"] = rowData["Student Email"];
          rowData["emergencyNumber"] =
            rowData["Emergency Contact No. (Father / Mother / Guardian)"];
          rowData["address"] =
            rowData["Student Address\r"] || rowData["Student Address"];
          if (
            rowData["Gender"] == Gender.MALE ||
            rowData["Gender"] == Gender.FEMALE ||
            rowData["Gender"] == Gender.OTHER
          ) {
            rowData["gender"] = rowData["Gender"];
          } else {
            rowData["gender"] = null;
          }
          rowData["dob"] = this.parseDate(rowData["Date of Birth"]);
          rowData["rfidNo"] = rowData["RFID Card No."];
          rowData["classListId"] = null;
          rowData["classDivId"] = null;
          rowData["status"] = DefaultStatus.ACTIVE;
          rowData["houseZoneId"] = null;
          rowData["updatedId"] = updatedId;
          // rowData["rfidNo"] = Date.now().toString();
          rowData["organizationDetailId"] = organizationDetailId;
          const classListId = classList.find(
            (classItem) => classItem.name === rowData["Class"]
          );
          if (classListId) {
            rowData["classListId"] = classListId.id || null;
          }
          const classDivId = classDiv.find(
            (classItem) => classItem.name === rowData["Section"]
          );
          if (classDivId) {
            rowData["classDivId"] = classDivId.id || null;
          }
          const houseZoneId = houseZone.find(
            (classItem) => classItem.name === rowData["House Zone"]
          );
          if (houseZoneId) {
            rowData["houseZoneId"] = houseZoneId.id || null;
          }
          console.log(rowData);
          const payload = await this.studentsService.createCSV(
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

  @Post()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "student"])
  create(@Body() dto: CreateStudentDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    dto.settingId = user.settingId;
    dto.PEN = dto.PEN ? dto.PEN + "*" : "*";
    dto.UID = dto.PEN ? dto.PEN + "*" : "*";
    dto["srNo"] = dto.studentNo;
    return this.studentsService.create(dto);
  }

  @Post(":organizationDetailId/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, "student"])
  createBySchool(
    @Param("organizationDetailId") organizationDetailId: string,
    @Param("settingId") settingId: string,
    @Body() dto: CreateStudentDto
  ) {
    dto.organizationDetailId = organizationDetailId;
    dto.settingId = settingId;
    dto.PEN = dto.PEN ? dto.PEN + "*" : "*";
    dto.UID = dto.PEN ? dto.PEN + "*" : "*";
    dto["srNo"] = dto.studentNo;
    return this.studentsService.create(dto);
  }

  @Get("by-creater")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  find(@CurrentUser() user: Account, @Query() dto: CommonPaginationDto) {
    return this.studentsService.findAll(user.settingId, dto, "s");
  }

  @Get("all/:organizationId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAll(
    @Param("organizationId") organizationId: string,
    @Query() dto: CommonPaginationDto
  ) {
    return this.studentsService.findAll(organizationId, dto, "o");
  }

  @Get("card-generate/:organizationId/:classId/:cardStatus")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "card_correction"])
  generateCard(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string,
    @Param("cardStatus") cardStatus: any
  ) {
    return this.studentsService.generateCorrectionCard(
      organizationId,
      classId,
      cardStatus
    );
  }

  @Get("class/:organizationId/:classId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAllByClass(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string,
    @Query() dto: CommonPaginationDto
  ) {
    return this.studentsService.findAllByClass(organizationId, classId, dto);
  }

  @Get("class-list/:organizationId/:classId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAllByClassList(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string,
    @Query() dto: CommonPaginationDto
  ) {
    return this.studentsService.findAllByClassList(
      organizationId,
      classId,
      dto
    );
  }

  @Get("class-div-attendance/:organizationId/:classId/:divId/:date")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAllByClassDivWithAttendance(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string,
    @Param("divId") divId: string,
    @Param("date") date: string,
    @Query() dto: CommonPaginationDto
  ) {
    return this.studentsService.findAllByClassDivWithAttendance(
      organizationId,
      classId,
      divId,
      date,
      dto
    );
  }

  @Get("class-div/:organizationId/:classId/:divId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAllByClassDiv(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string,
    @Param("divId") divId: string,
    @Query() dto: CommonPaginationDto
  ) {
    return this.studentsService.findAllByClassDiv(
      organizationId,
      classId,
      divId,
      dto
    );
  }

  @Get("class-div-zone/:organizationId/:classId/:divId/:zoneId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAllByClassDivZone(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string,
    @Param("divId") divId: string,
    @Param("zoneId") zoneId: string,
    @Query() dto: CommonPaginationDto
  ) {
    return this.studentsService.findAllByClassDivZone(
      organizationId,
      classId,
      divId,
      zoneId,
      dto
    );
  }

  // @Get('download-excel/:organizationId')
  // async downloadExcel(@Res() res: Response) {
  //   const payload: any[] = await this.studentsService.findAllForExcel();
  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet('Records');

  //   // Add headers
  //   sheet.addRow(['Field1', 'Field2', 'Field3']);

  //   // Add data
  //   payload.forEach((record) => {
  //     sheet.addRow([record.id, record.name, record.contactNo]);
  //   });

  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );
  //   res.setHeader('Content-Disposition', 'attachment; filename=records.xlsx');

  //   await workbook.xlsx.write(res);
  //   return res.end();
  // }

  @Get("dashboard/:all")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findAllByDash(
    @Query() query: PaginationDtoWithDate,
    @Param("all") all: string
  ) {
    return this.studentsService.findAllByDashboard(query, all);
  }

  @Get("final-card-generate/:organizationId/:classId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "card_print"])
  finalGenerateCard(
    @Param("organizationId") organizationId: string,
    @Param("classId") classId: string
  ) {
    return this.studentsService.generateCard(organizationId, classId);
  }

  @Get("my-child")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(...Object.values(UserRole))
  myChilds(@CurrentUser() user: Account) {
    return this.studentsService.myChilds(user.id);
  }

  @Get("profile-final-card-generate/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "card_print"])
  profileFinalGenerateCard(@Param("id") id: string) {
    return this.studentsService.generateProfile(id);
  }

  @Get("profile/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "card_print"])
  profile(@Param("id") id: string) {
    return this.studentsService.studentDetails(id);
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findWholeStudent(@Query() dto: CommonPaginationDto) {
    return this.studentsService.findWholeStudent(dto);
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "student"])
  findOne(@Param("id") id: string) {
    return this.studentsService.studentDetails(id);
  }

  @Patch(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "student"])
  update(@Param("id") id: string, @Body() dto: UpdateStudentDto) {
    dto["srNo"] = dto.studentNo;
    return this.studentsService.update(id, dto);
  }

  @Put("profile/:id/:type/:orgId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, "staff_detail"])
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: imageFileFilter,
    })
  )
  async imageUpdate(
    @UploadedFile() file: Express.Multer.File,  // <-- Change the type here
    @Param("id") id: string,
    @Param("type") type: string,
    @Param("orgId") orgId: string
  ) {
    const fileData = await this.studentsService.findOne(id);
    if (fileData.profileName) {
      if (type === "Student") {
        deleteFileHandler(fileData.profileName);
      }
      if (type === "Father") {
        deleteFileHandler(fileData.fatherImageName);
      }
      if (type === "Mother") {
        deleteFileHandler(fileData.motherImageName);
      }
      if (type === "Guardian") {
        deleteFileHandler(fileData.guardianImageName);
      }
    }
    const photoNumber = "A" + Date.now().toString();
    const fileName = orgId + "/students/" + photoNumber + ".webp";
    const payload = await uploadFileHandler(fileName, file.buffer);
    if (payload.HttpCode !== 201) {
      throw new NotAcceptableException(
        "File not uploaded. Try after some time!"
      );
    }
    if (type === "Student") {
      return this.studentsService.image(fileName, fileData, photoNumber);
    }
    if (type === "Father") {
      return this.studentsService.fatherImage(fileName, fileData, photoNumber);
    }
    if (type === "Mother") {
      return this.studentsService.motherImage(fileName, fileData, photoNumber);
    }
    if (type === "Guardian") {
      return this.studentsService.guardianImage(
        fileName,
        fileData,
        photoNumber
      );
    }
  }

  @Put("card")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "student"])
  cards(@Body() dto: StudentCardDto[]) {
    return this.studentsService.card(dto);
  }

  @Put("promote-class")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "student"])
  promoteClass(@Body() dto: PromoteClassDto[]) {
    dto.forEach((element) => {
      element["card"] = false;
    });
    return this.studentsService.promoteClass(dto);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, "student"])
  status(@Param("id") id: string, @Body() status: DefaultStatusDto) {
    return this.studentsService.status(id, status);
  }
}
