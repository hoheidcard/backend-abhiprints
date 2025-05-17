import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonPaginationDto } from "../common/dto/common-pagination.dto";
import { DefaultStatusDto } from "../common/dto/default-status.dto";
import { DefaultStatus } from "src/enum";
import { EditorDesignDto } from "src/id-cards-stock/dto/card-design.dto";
import { IdCardsStock } from "src/id-cards-stock/entities/id-cards-stock.entity";
import { Student } from "src/students/entities/student.entity";
import { Brackets, Not, Repository } from "typeorm";
import {
  ClassListDivDto,
  ClassListDto,
  PProductDto,
  ProductDto,
} from "./dto/class-list.dto";
import { ClassListDiv } from "./entities/class-list-div.entity";
import { ClassList } from "./entities/class-list.entity";

@Injectable()
export class ClassListService {
  constructor(
    @InjectRepository(ClassList)
    private readonly classListRepo: Repository<ClassList>,
    @InjectRepository(ClassListDiv)
    private readonly classListDivRepo: Repository<ClassListDiv>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(IdCardsStock)
    private readonly cardRepo: Repository<IdCardsStock>
  ) {}

  async create(dto: ClassListDto) {
    const result = await this.classListRepo.findOne({
      where: {
        name: dto.name,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (result) {
      throw new ConflictException("Class List Already Register!");
    }
    const checkAready = await this.classListRepo.findOne({
      where: {
        priority: dto.priority,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (checkAready) {
      throw new NotAcceptableException("Priority already exists!");
    }
    const obj = Object.create(dto);
    return this.classListRepo.save(obj);
  }

  async findAllBySchool(settingId) {
    const [result, total] = await this.classListRepo
      .createQueryBuilder("classList")
      .select(["classList.id", "classList.name", "classList.priority"])
      .where("classList.settingId = :settingId", { settingId })
      .orderBy({ "classList.priority": "ASC" })
      .getManyAndCount();
    return { result, total };
  }

  async findAll(query: CommonPaginationDto) {
    const keyword = query.keyword || "";
    const [result, total] = await this.classListRepo
      .createQueryBuilder("classList")
      .select([
        "classList.id",
        "classList.name",
        "classList.priority",
        "classList.createdAt",
      ])
      .andWhere(
        new Brackets((qb) => {
          if (keyword) {
            qb.where("classList.name LIKE :name", {
              name: "%" + keyword + "%",
            });
          }
        })
      )
      .orderBy({ "classList.priority": "ASC" })
      .take(query.limit)
      .skip(query.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.classListRepo.findOne({ where: { id: id } });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return result;
  }

  async findCoOrdinatorClass(coOrdinatorId: string) {
    return this.classListDivRepo
      .createQueryBuilder("classListDiv")
      .leftJoinAndSelect("classListDiv.classList", "classList")
      .leftJoinAndSelect("classListDiv.classDiv", "classDiv")
      .select([
        "classListDiv.id",
        "classListDiv.coOrdinatorId",
        "classListDiv.classListId",
        "classListDiv.classDivId",
        "classList.id",
        "classList.name",
        "classDiv.id",
        "classDiv.name",
      ])
      .andWhere("classListDiv.coOrdinatorId = :coOrdinatorId", {
        coOrdinatorId: coOrdinatorId,
      })
      .getMany();
  }

  async updateSetting(dto: ClassListDivDto) {
    console.log(dto);
    const result = await this.classListDivRepo.findOne({
      where: dto,
    });
    if (!result) {
      // if (dto.staffDetailId) {
      //   const teacher = await this.classListDivRepo.findOne({
      //     where: { staffDetailId: dto.staffDetailId },
      //   });
      //   if (teacher) {
      //     throw new NotFoundException(
      //       'This teacher already assign to other class!',
      //     );
      //   }
      // }
      const obj = Object.create(dto);
      return this.classListDivRepo.save(obj);
    } else {
      throw new ConflictException("Already exists!");
    }
  }

  async update(id: string, dto: ClassListDto) {
    const result = await this.findOne(id);
    const checkAready = await this.classListRepo.findOne({
      where: {
        id: Not(id),
        priority: dto.priority,
        settingId: dto.settingId,
        status: DefaultStatus.ACTIVE,
      },
    });
    if (checkAready) {
      throw new NotAcceptableException("Priority already exists!");
    }
    const obj = Object.assign(result, dto);
    return this.classListRepo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.findOne(id);
    if (dto.status === DefaultStatus.DELETED) {
      const studentCount = await this.studentRepo.count({
        where: { classListId: id },
      });
      if (studentCount > 0) {
        throw new NotAcceptableException(
          "Students in this class. So you cannot delete this class!"
        );
      }
    }
    const obj = Object.assign(result, dto);
    return this.classListRepo.save(obj);
  }

  async products(dto: ProductDto[]) {
    if (dto.length > 0) {
      const stock = await this.cardRepo.findOne({
        select: ["card"],
        where: { id: dto[0].idCardsStockId },
      });
      if(!stock) {
        throw new NotAcceptableException('Please card first!');
      }
      dto.forEach((element) => {
        element.card = stock.card;
      });
    }

    return this.classListRepo.save(dto);
  }

  async pproducts(dto: PProductDto[]) {
    if (dto.length > 0) {
      const stock = await this.cardRepo.findOne({
        select: ["card"],
        where: { id: dto[0].pIdCardsStockId },
      });
      if(!stock) {
        throw new NotAcceptableException('Please card first!');
      }
      dto.forEach((element) => {
        element.pcard = stock.card;
      });
    }

    return this.classListRepo.save(dto);
  }

  async updateSEditor(id: string, settingId, dto: EditorDesignDto) {
    const result = await this.classListRepo.findOne({
      where: { id, settingId },
    });
    if (!result) {
      throw new NotFoundException(" Not Found !");
    }
    const obj = Object.assign(result, dto);
    return this.classListRepo.save(obj);
  }

  async updatePEditor(id: string, settingId, dto: EditorDesignDto) {
    const result = await this.classListRepo.findOne({
      where: { id, settingId },
    });
    if (!result) {
      throw new NotFoundException(" Not Found !");
    }
    const obj = Object.assign(result, dto);
    return this.classListRepo.save(obj);
  }

  async remove(id: string) {
    const result = await this.classListDivRepo.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException("Not Found!");
    }
    return this.classListDivRepo.remove(result);
  }
}
