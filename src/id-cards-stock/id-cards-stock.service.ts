import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassList } from "../class-list/entities/class-list.entity";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { DefaultStatusPaginationDto } from "../common/dto/pagination-with-default-status.dto";
import { Designation } from "../designation/entities/designation.entity";
import { DefaultStatus } from "../enum";
import { HouseZone } from "../house-zones/entities/house-zone.entity";
import { StaffDetail } from "../staff-details/entities/staff-detail.entity";
import { Student } from "../students/entities/student.entity";
import { Like, Repository, SelectQueryBuilder } from "typeorm";
import { EditorDesignDto, ProductDetailDto } from "./dto/card-design.dto";
import { IdCardsStock } from "./entities/id-cards-stock.entity";

@Injectable()
export class IdCardsStockService {
  constructor(
    @InjectRepository(IdCardsStock)
    private readonly repo: Repository<IdCardsStock>,
    @InjectRepository(ClassList)
    private readonly classListRepo: Repository<ClassList>,
    @InjectRepository(Designation)
    private readonly designationRepo: Repository<Designation>,
    @InjectRepository(HouseZone)
    private readonly hzRepo: Repository<HouseZone>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(StaffDetail)
    private readonly staffDetailRepo: Repository<StaffDetail>
  ) {}

  async create(dto: ProductDetailDto) {
    const result = await this.repo.findOne({ where: dto });
    if (result) {
      throw new ConflictException("This card already exists");
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo.findAndCount({
      relations: ["productImage", "productVariant"],
      where: { status: dto.status, title: Like("%" + keyword + "%") },
      order: { title: "ASC" },
      skip: dto.offset,
      take: dto.limit,
    });
    return { result, total };
  }

  async find(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo.findAndCount({
      relations: ["productImage"],
      where: { status: DefaultStatus.ACTIVE, title: Like("%" + keyword + "%") },
      order: { title: "ASC" },
      skip: dto.offset,
      take: dto.limit,
    });
    return { result, total };
  }
  async findMenu(dto: CommonPaginationDto) {
    const keyword = dto.keyword || "";
    const [result, total] = await this.repo.findAndCount({
      relations: ["productImage"],
      where: { status: DefaultStatus.ACTIVE, title: Like("%" + keyword + "%") },
      order: { title: "ASC" },
      skip: dto.offset,
      take: dto.limit,
    });
    return { result, total };
  }
  
  async findByCatId(id: string) {
    const [result, total] = await this.repo.findAndCount({
      relations: ["productImage"],
      where: { status: DefaultStatus.ACTIVE, categoryId: id },
      order: { title: "ASC" },
  
    });
    return { result, total };
  }

  async findById(id: string) {
    const result = await this.repo.findOne({ 
      relations: ["productImage" ,"productVariant"],
      where: { id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

    
  async findOne(id: string) {
    const result = await this.repo.findOne({
      relations: ["productImage", "productVariant"],
      where: { id },
    });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    result.productVariant = result.productVariant.reduce((acc, variant) => {
      const { type, name, id, } = variant;
      let group = acc.find((g) => g.name === type);
      if (!group) {
        group = { name: type, list: [], modelName: null };
        acc.push(group);
      }
      group.list.push({id, name, type});
      return acc;
    }, []);
    console.log(result.productImage);
    return result;
  }

  async findMaxDetailStudent(
    settingId: string
  ): Promise<{ [key: string]: string }> {
    try {
      const queryBuilder = this.studentRepo
        .createQueryBuilder("student")
        .leftJoinAndSelect("student.classList", "classList")
        .leftJoinAndSelect("student.classDiv", "classDiv")
        .leftJoinAndSelect("student.houseZone", "houseZone")
        .leftJoinAndSelect("student.organizationDetail", "organizationDetail")
        .where("student.settingId = :settingId", { settingId: settingId });

      // Prepare an object to hold results
      const maxValues: { [key: string]: string } = {};

      const columns = [
        { entity: "student", propertyName: "regNo" },
        { entity: "student", propertyName: "name" },
        { entity: "student", propertyName: "emailId" },
        { entity: "student", propertyName: "rollNo" },
        { entity: "student", propertyName: "rfidNo" },
        { entity: "student", propertyName: "photoNumber" },
        { entity: "student", propertyName: "aadharNumber" },
        { entity: "student", propertyName: "srNo" },
        { entity: "student", propertyName: "bloodGroup" },
        { entity: "student", propertyName: "address" },
        { entity: "student", propertyName: "city" },
        { entity: "student", propertyName: "contactNo" },
        { entity: "student", propertyName: "fatherContactNo" },
        { entity: "student", propertyName: "motherContactNo" },
        { entity: "student", propertyName: "guardianContactNo" },
        { entity: "student", propertyName: "guardianRelation" },
        { entity: "student", propertyName: "state" },
        { entity: "student", propertyName: "gender" },
        { entity: "student", propertyName: "dob" },
        { entity: "student", propertyName: "UID" },
        { entity: "student", propertyName: "PEN" },
        { entity: "student", propertyName: "profile" },
        { entity: "student", propertyName: "fatherImage" },
        { entity: "student", propertyName: "motherImage" },
        { entity: "student", propertyName: "guardianImage" },
        { entity: "student", propertyName: "fatherName" },
        { entity: "student", propertyName: "motherName" },
        { entity: "student", propertyName: "guardianName" },
        { entity: "classList", propertyName: "name" },
        { entity: "classDiv", propertyName: "name" },
        { entity: "houseZone", propertyName: "name" },
        { entity: "organizationDetail", propertyName: "name" },
        { entity: "organizationDetail", propertyName: "address" },
        { entity: "organizationDetail", propertyName: "image" },
        { entity: "organizationDetail", propertyName: "contactNo" },
      ];

      // Loop through each column and fetch max length
      for (const column of columns) {
        const maxLengthResult = await this.getMaxColumnValueForStudent(
          queryBuilder,
          column.entity,
          column.propertyName
        );
        maxValues[`${column.entity}.${column.propertyName}`] = maxLengthResult;
      }

      return maxValues;
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException(
        "Max data checker not working. Try after some time!"
      );
    }
  }

  private async getMaxColumnValueForStudent(
    queryBuilder: SelectQueryBuilder<Student>,
    entity: string,
    columnName: string
  ): Promise<string> {
    const maxValueQuery = await queryBuilder
      .addSelect(`${entity}.${columnName}`, "max_value")
      .orderBy(`CHAR_LENGTH(TRIM(${entity}.${columnName}))`, "DESC")
      .limit(1)
      .getRawOne();

    return maxValueQuery ? maxValueQuery.max_value : "";
  }

  async findMaxDetailStaff(
    settingId: string
  ): Promise<{ [key: string]: string }> {
    try {
      const queryBuilder = this.staffDetailRepo
        .createQueryBuilder("staffDetail")
        .leftJoinAndSelect("staffDetail.account", "account")
        .leftJoinAndSelect("staffDetail.designation", "designation")
        .leftJoinAndSelect(
          "staffDetail.organizationDetail",
          "organizationDetail"
        )
        .where("staffDetail.settingId = :settingId", { settingId: settingId });

      // Prepare an object to hold results
      const maxValues: { [key: string]: string } = {};
      const columns = [
        { entity: "staffDetail", propertyName: "employeeId" },
        { entity: "staffDetail", propertyName: "rfidNo" },
        { entity: "staffDetail", propertyName: "name" },
        { entity: "staffDetail", propertyName: "emailId" },
        { entity: "staffDetail", propertyName: "aadharNumber" },
        { entity: "staffDetail", propertyName: "cast" },
        { entity: "staffDetail", propertyName: "photoNumber" },
        { entity: "staffDetail", propertyName: "religion" },
        { entity: "staffDetail", propertyName: "nationality" },
        { entity: "staffDetail", propertyName: "contactNo" },
        { entity: "staffDetail", propertyName: "altContactNo" },
        { entity: "staffDetail", propertyName: "address" },
        { entity: "staffDetail", propertyName: "city" },
        { entity: "staffDetail", propertyName: "state" },
        { entity: "staffDetail", propertyName: "pincode" },
        { entity: "staffDetail", propertyName: "profile" },
        { entity: "staffDetail", propertyName: "profileName" },
        { entity: "staffDetail", propertyName: "gender" },
        { entity: "staffDetail", propertyName: "dob" },
        { entity: "staffDetail", propertyName: "joiningDate" },
        { entity: "designation", propertyName: "name" },
        { entity: "organizationDetail", propertyName: "name" },
      ];

      // Loop through each column and fetch max length
      for (const column of columns) {
        const maxLengthResult = await this.getMaxColumnValueForStaff(
          queryBuilder,
          column.entity,
          column.propertyName
        );
        maxValues[`${column.entity}.${column.propertyName}`] = maxLengthResult;
      }

      const data = maxValues;
      console.log(data);
      return maxValues;
    } catch (error) {
      // console.log(error);
      throw new NotAcceptableException(
        "Max data checker not working. Try after some time!"
      );
    }
  }

  private async getMaxColumnValueForStaff(
    queryBuilder: SelectQueryBuilder<StaffDetail>,
    entity: string,
    columnName: string
  ): Promise<string> {
    const maxValueQuery = await queryBuilder
      .addSelect(`${entity}.${columnName}`, "max_value")
      .orderBy(`CHAR_LENGTH(TRIM(${entity}.${columnName}))`, "DESC")
      .limit(1)
      .getRawOne();

    return maxValueQuery ? maxValueQuery.max_value : "";
  }

  async findDetail(id: string, settingId: string, type: string, sp: string) {
    let result = null;
    if (type === "Editor") {
      result = await this.repo.findOne({ select: ["card"], where: { id } });
    }
    if (type === "Class" && sp == "Student") {
      result = await this.classListRepo.findOne({
        select: ["card"],
        where: { id, settingId },
      });
    }
    if (type === "Class" && sp == "Parent") {
      result = await this.classListRepo.findOne({
        select: ["pcard"],
        where: { id, settingId },
      });
      if (result) {
        result["card"] = result.pcard;
      }
    }
    if (type === "House") {
      result = await this.hzRepo.findOne({
        select: ["card"],
        where: { id, settingId },
      });
    }
    if (type === "Designation") {
      result = await this.designationRepo.findOne({
        select: ["card"],
        where: { id, settingId },
      });
    }
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async update(id: string, dto: ProductDetailDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async updateEditor(id: string, dto: EditorDesignDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, status: DefaultStatusDto) {
    const result = await this.findOne(id);
    const obj = Object.assign(result, status);
    return this.repo.save(obj);
  }

  async image(image: string, result: IdCardsStock) {
    const obj = Object.assign(result, {
      image: process.env.HOC_CDN_LINK + image,
      imageName: image,
    });
    return this.repo.save(obj);
  }
}
