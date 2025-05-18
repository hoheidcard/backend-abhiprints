import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { createObjectCsvStringifier } from "csv-writer";
import { Response } from "express";
import { Account } from "../account/entities/account.entity";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CheckPermissions } from "../auth/decorators/permissions.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrderStatus, PermissionAction, UserRole } from "../enum";
import { CardOrdersService } from "./card-orders.service";
import {
  ORderStatusDto,
  StaffCardOrderDto,
  StudentCardOrderDto,
} from "./dto/card-order.dto";
import { PaginationDto } from "./dto/pagination.dto";

@Controller("card-orders")
export class CardOrdersController {
  constructor(private readonly cardOrdersService: CardOrdersService) {}

  @Post("staff/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, "card_order"])
  createStaffOrder(
    @Body() dto: StaffCardOrderDto,
    @CurrentUser() user: Account,
    @Param("settingId") settingId: string
  ) {
    dto.staffAccountId = user.id;
    dto.settingId = settingId;
    return this.cardOrdersService.createStaffOrder(dto);
  }

  @Post("student/:settingId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.CREATE, "card_order"])
  createStudentORder(
    @Body() dto: StudentCardOrderDto,
    @CurrentUser() user: Account,
    @Param("settingId") settingId: string
  ) {
    dto.staffAccountId = user.id;
    dto.settingId = settingId;
    return this.cardOrdersService.createStudentOrder(dto);
  }

  // compressImage(url) {
  //   // Use URL constructor to parse the URL
  //   const urlObject = new URL(url);
  //   // Get the pathname from the URL object, then split it to get the last part (the image name)
  //   const pathSegments = urlObject.pathname.split("/");
  //   // Return the last segment which is the image name
  //   const imageName = pathSegments[pathSegments.length - 1];

  //   const datePattern = /\d{13}/;
  //   if (datePattern.test(imageName)) {
  //     return url + "?quality=50";
  //   } else {
  //     return url;
  //   }
  // }

  @Get("download-image")
  async downloadImage(@Res() res: Response, @Query() dto) {
    try {
      const { buffer, fileName } = await this.cardOrdersService.downloadImage(
        dto.image + "?quality=50"
      );

      // Set headers for file download
      res.set("Content-Type", "image/jpeg"); // Set Content-Type to image/jpeg for JPEG images
      const newFileName = fileName.replace(".webp", ".jpg"); // Replace .webp with .jpg in filename
      res.set("Content-Disposition", `attachment; filename="${newFileName}"`);
      res.send(buffer);
    } catch (error) {
      res.status(500).send("Error downloading images");
    }
  }

  @Get("download-staff-csv/:orderId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "csv_download"])
  async downloadStaffCSV(
    @Res() res: Response,
    @Param("orderId") orderId: string
  ) {
    const staffData = await this.cardOrdersService.findStaffForCsv(orderId);
    if (staffData.length <= 0) {
      throw new NotFoundException("No staff selected in this order!");
    }

    const csvSetting = await this.cardOrdersService.findCSV(
      staffData[0].settingId
    );
    if (!csvSetting || !csvSetting.staffCsvFields) {
      throw new NotFoundException("Please select csv fields from setting!");
    }
    const fields = JSON.parse(csvSetting.staffCsvFields);
    const header = [];
    fields.forEach((element) => {
      header.push({ id: element, title: element });
    });
    const csvStringifier = createObjectCsvStringifier({
      header: header,
    });

    const data = [];
    staffData.forEach((element) => {
      data.push({
        id: element.id,
        "Employee Id": element.employeeId,
        "RFID Card No.": element.rfidNo,
        "Aadhar No.": element.aadharNumber,
        "Employee Name": element.name,
        "Employee Photo Number": element.photoNumber,
        "Employee Designation": element.designation
          ? element.designation["name"]
          : null,
        "Employee Address": element.address,
        "Date of Joining": this.formatDate(element.joiningDate),
        "Employee Email": element.emailId,
        "Employee Contact No.": element.contactNo,
        "Date of Birth": this.formatDate(element.dob),
        Gender: element.gender,
        "Spouse Name": element.spouseName,
        "Father Name": element.guardianName,
        "Spouse Contact No.": element.spouseContactNo,
        "Father Contact No.": element.guardianContactNo,
      });
    });

    // Convert data to CSV string
    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=records.csv");

    res.send(csvData);
  }

  @Get("download-staff-csv-org/:orgId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "csv_download"])
  async downloadStaffCSVByOrg(
    @Res() res: Response,
    @Param("orgId") orgId: string
  ) {
    const staffData = await this.cardOrdersService.findStaffForCsvOrg(orgId);
    if (staffData.length <= 0) {
      throw new NotFoundException("No staff selected in this order!");
    }
    const csvSetting = await this.cardOrdersService.findCSV(orgId);
    if (!csvSetting || !csvSetting.staffCsvFields) {
      throw new NotFoundException("Please select csv fields from setting!");
    }
    const fields = JSON.parse(csvSetting.staffCsvFields);
    const header = [];
    fields.forEach((element) => {
      header.push({ id: element, title: element });
    });
    const csvStringifier = createObjectCsvStringifier({
      header: header,
    });
    const data = [];
    staffData.forEach((element) => {
      data.push({
        id: element.id,
        "Employee Id": element.employeeId,
        "RFID Card No.": element.rfidNo,
        "Aadhar No.": element.aadharNumber,
        "Employee Name": element.name,
        "Employee Photo Number": element.photoNumber,
        "Employee Designation": element.designation
          ? element.designation["name"]
          : null,
        "Employee Address": element.address,
        "Date of Joining": this.formatDate(element.joiningDate),
        "Employee Email": element.emailId,
        "Employee Contact No.": element.contactNo,
        "Date of Birth": this.formatDate(element.dob),
        Gender: element.gender,
        "Spouse Name": element.spouseName,
        "Father Name": element.guardianName,
        "Spouse Contact No.": element.spouseContactNo,
        "Father Contact No.": element.guardianContactNo,
      });
    });

    // Convert data to CSV string
    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=records.csv");

    res.send(csvData);
  }

  @Get("download-student-csv-org/:organizationId/:classes")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "csv_download"])
  async downloadStudentCSVOrg(
    @Res() res: Response,
    @Param("classes") classes: string,
    @Param("organizationId") organizationId: string
  ) {
    const studentData = await this.cardOrdersService.findStudentForCsvOrg(
      organizationId,
      classes
    );
    if (studentData.length <= 0) {
      throw new NotFoundException("No student selected in this order!");
    }
    const csvSetting = await this.cardOrdersService.findCSV(organizationId);
    if (!csvSetting || !csvSetting.csvFields) {
      throw new NotFoundException("Please select csv fields from setting!");
    }
    const fields = JSON.parse(csvSetting.csvFields);
    const header = [];
    fields.forEach((element) => {
      header.push({ id: element, title: element });
    });
    const csvStringifier = createObjectCsvStringifier({
      header: header,
    });
    // // Create an array of objects representing rows of data
    const data = [];
    studentData.forEach((element) => {
      data.push({
        "SR. No.": element.srNo,
        "Reg. No.": element.regNo,
        "Admission No.": element.admissionNo,
        "Roll No.": element.rollNo,
        "Unique ID": element.UID,
        "Permanent Education Number": element.PEN,
        "RFID Card No.": element.rfidNo,
        "Aadhar No.": element.aadharNumber,
        "Student Name": element.name,
        "Father Name": element.fatherName,
        "Mother Name": element.motherName,
        "Guardian Name": element.guardianName,
        "Student Photo Number": element.photoNumber,
        "Father Photo Number": this.getPhotoNumber(element.fatherImage),
        "Mother Photo Number": this.getPhotoNumber(element.motherImage),
        "Guardian Photo Number": this.getPhotoNumber(element.guardianImage),
        "Student Contact No.": element.contactNo,
        "Father Contact No.": element.fatherContactNo,
        "Mother Contact No.": element.motherContactNo,
        "Guardian Contact No.": element.guardianContactNo,
        "Guardian Relationship": element.guardianRelation,
        "Date of Birth": this.formatDate(element.dob),
        Class: element.classList ? element.classList["name"] : null,
        Section: element.classDiv ? element.classDiv["name"] : null,
        "Student Address": element.address,
        "House Zone": element.houseZone ? element.houseZone["name"] : null,
        "Blood Group": element.bloodGroup,
        Gender: element.gender,
        "Student Email": element.emailId,
        "Emergency Contact No. (Father / Mother / Guardian)":
          element.emergencyNumber,
      });
    });
    // // Convert data to CSV string
    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=records.csv");

    res.send(csvData);
  }

  @Get("download-student-csv/:orderId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "csv_download"])
  async downloadStudentCSV(
    @Res() res: Response,
    @Param("orderId") orderId: string
  ) {
    const studentData = await this.cardOrdersService.findStudentForCsv(orderId);
    console.log(studentData);
    if (studentData.length <= 0) {
      throw new NotFoundException("No student selected in this order!");
    }
    const csvSetting = await this.cardOrdersService.findCSV(
      studentData[0].settingId
    );
    if (!csvSetting || !csvSetting.csvFields) {
      throw new NotFoundException("Please select csv fields from setting!");
    }
    const fields = JSON.parse(csvSetting.csvFields);
    const header = [];
    fields.forEach((element) => {
      header.push({ id: element, title: element });
    });
    const csvStringifier = createObjectCsvStringifier({
      header: header,
    });

    // // Create an array of objects representing rows of data
    const data = [];
    studentData.forEach((element) => {
      data.push({
        "SR. No.": element.srNo,
        "Reg. No.": element.regNo,
        "Admission No.": element.admissionNo,
        "Roll No.": element.rollNo,
        "Unique ID": element.UID,
        "Permanent Education Number": element.PEN,
        "RFID Card No.": element.rfidNo,
        "Aadhar No.": element.aadharNumber,
        "Student Name": element.name,
        "Father Name": element.fatherName,
        "Mother Name": element.motherName,
        "Guardian Name": element.guardianName,
        "Student Photo Number": element.photoNumber,
        "Father Photo Number": this.getPhotoNumber(element.fatherImage),
        "Mother Photo Number": this.getPhotoNumber(element.motherImage),
        "Guardian Photo Number": this.getPhotoNumber(element.guardianImage),
        "Student Contact No.": element.contactNo,
        "Father Contact No.": element.fatherContactNo,
        "Mother Contact No.": element.motherContactNo,
        "Guardian Contact No.": element.guardianContactNo,
        "Guardian Relationship": element.guardianRelation,
        "Date of Birth": this.formatDate(element.dob),
        Class: element.classList ? element.classList["name"] : null,
        Section: element.classDiv ? element.classDiv["name"] : null,
        "Student Address": element.address,
        "House Zone": element.houseZone ? element.houseZone["name"] : null,
        "Blood Group": element.bloodGroup,
        Gender: element.gender,
        "Student Email": element.emailId,
        "Emergency Contact No. (Father / Mother / Guardian)":
          element.emergencyNumber,
      });
    });

    // // Convert data to CSV string
    const csvData =
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=records.csv");

    res.send(csvData);
  }

  getPhotoNumber(url: string) {
    if (url) {
      const photoName = url.substring(url.lastIndexOf("/") + 1);
      return photoName.split(".")[1];
    } else {
      return null;
    }
  }

  formatDate(date: Date): string {
    if (!date) return null;
    date = new Date(date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  @Get("download-staff-file/:orderId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "file_download"])
  async downloadStaffImages(
    @Res() res: Response,
    @Param("orderId") orderId: string
  ) {
    const staffData = await this.cardOrdersService.findStaffForImage(orderId);
    if (staffData.length <= 0) {
      throw new NotFoundException("No staff selected for this order!");
    }
    const imageUrls = [];
    staffData.forEach((element) => {
      if (element.profile) {
        imageUrls.push(element.profile);
      }
    });
    try {
      const images =
        await this.cardOrdersService.downloadImagesFromCDN(imageUrls);
      const zipData = await this.cardOrdersService.createZip(images);

      res.set("Content-Type", "application/zip");
      res.set("Content-Disposition", "attachment; filename=staff.zip");
      res.send(zipData);
    } catch (error) {
      res.status(500).send("Error downloading images");
    }
  }

  @Get("download-staff-file-org/:organizationId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "file_download"])
  async downloadStaffOrgImages(
    @Res() res: Response,
    @Param("organizationId") organizationId: string
  ) {
    const staffData =
      await this.cardOrdersService.findStaffOrgForImage(organizationId);
    if (staffData.length <= 0) {
      throw new NotFoundException("No staff selected for this order!");
    }
    const imageUrls = [];
    staffData.forEach((element) => {
      if (element.profile) {
        imageUrls.push(element.profile);
      }
    });

    try {
      const images =
        await this.cardOrdersService.downloadImagesFromCDN(imageUrls);
      const zipData = await this.cardOrdersService.createZip(images);

      res.set("Content-Type", "application/zip");
      res.set("Content-Disposition", "attachment; filename=staff.zip");
      res.send(zipData);
    } catch (error) {
      res.status(500).send("Error downloading images");
    }
  }

  @Get("download-student-file/:orderId")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "file_download"])
  async downloadStudentImages(
    @Res() res: Response,
    @Param("orderId") orderId: string
  ) {
    const studentData =
      await this.cardOrdersService.findStudentForImage(orderId);
    if (studentData.length <= 0) {
      throw new NotFoundException("No student selected for this order!");
    }
    const imageUrls = [];
    studentData.forEach((element) => {
      if (element.profile) {
        imageUrls.push(element.profile);
      }
      if (element.fatherImage) {
        imageUrls.push(element.fatherImage);
      }
      if (element.motherImage) {
        imageUrls.push(element.motherImage);
      }
      if (element.guardianImage) {
        imageUrls.push(element.guardianImage);
      }
    });
    try {
      const images =
        await this.cardOrdersService.downloadImagesFromCDN(imageUrls);
      const zipData = await this.cardOrdersService.createZip(images);

      res.set("Content-Type", "application/zip");
      res.set("Content-Disposition", "attachment; filename=student.zip");
      res.send(zipData);
    } catch (error) {
      res.status(500).send("Error downloading images");
    }
  }

  @Get("download-student-file-org/:organizationId/:classes")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "file_download"])
  async downloadStudentOrgImages(
    @Res() res: Response,
    @Param("organizationId") organizationId: string,
    @Param("classes") classes: string
  ) {
    const studentData = await this.cardOrdersService.findStudentOrgForImage(
      organizationId,
      classes
    );
    if (studentData.length <= 0) {
      throw new NotFoundException("No student found!");
    }
    const imageUrls = [];
    studentData.forEach((element) => {
      if (element.profile) {
        imageUrls.push(element.profile);
      }
      if (element.fatherImage) {
        imageUrls.push(element.fatherImage);
      }
      if (element.motherImage) {
        imageUrls.push(element.motherImage);
      }
      if (element.guardianImage) {
        imageUrls.push(element.guardianImage);
      }
    });
    try {
      const images =
        await this.cardOrdersService.downloadImagesFromCDN(imageUrls);
      const zipData = await this.cardOrdersService.createZip(images);

      res.set("Content-Type", "application/zip");
      res.set("Content-Disposition", "attachment; filename=student.zip");
      res.send(zipData);
    } catch (error) {
      res.status(500).send("Error downloading images");
    }
  }

  @Get()
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "card_order"])
  findAll(@Query() dto: PaginationDto, @CurrentUser() user: Account) {
    return this.cardOrdersService.findAll(
      dto,
      user.id,
      user.roles,
      user.settingId
    );
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.READ, "card_order"])
  findOne(@Param("id") id: string) {
    return this.cardOrdersService.findOne(id);
  }

  // organization send order to upper level
  @Patch("school-upper/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "card_order"])
  schoolUpper(@Param("id") id: string) {
    return this.cardOrdersService.assignSchoolToUpper(id);
  }

  @Patch("sub-partner-upper/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "card_order"])
  subPartnerUpper(@Param("id") id: string, @CurrentUser() user: Account) {
    return this.cardOrdersService.assignSubPartnerToUpper(id, user.id);
  }

  @Patch("partner-upper/:id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.UPDATE, "card_order"])
  partnerUpper(@Param("id") id: string, @CurrentUser() user: Account) {
    return this.cardOrdersService.assignPartnerToUpper(id, user.id);
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, "card_order"])
  status(@Param("id") id: string, @Body() dto: ORderStatusDto) {
    return this.cardOrdersService.status(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), RolesGuard, PermissionsGuard)
  @Roles(...(Object.values(UserRole) as string[]))
  @CheckPermissions([PermissionAction.DELETE, "card_order"])
  remove(@Param("id") id: string) {
    return this.cardOrdersService.status(id, { status: OrderStatus.DELETED });
  }
}
