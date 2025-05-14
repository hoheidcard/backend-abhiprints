import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultStatus } from 'src/enum';
import { Repository } from 'typeorm';
import { UpdateSettingDto } from './dto/create-setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly repo: Repository<Setting>,
  ) {}

  async findOne(id: string) {
    const result = await this.repo
      .createQueryBuilder("setting")
      .leftJoinAndSelect(
        "setting.bookCategory",
        "bookCategory",
        "bookCategory.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect(
        "setting.classDiv",
        "classDiv",
        "classDiv.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect(
        "setting.classList",
        "classList",
        "classList.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect("classList.idCardsStock", "idCardsStock")
      .leftJoinAndSelect("classList.pIdCardsStock", "pIdCardsStock")
      .leftJoinAndSelect("idCardsStock.productImage", "productImage")
      .leftJoinAndSelect("pIdCardsStock.productImage", "pproductImage")
      .leftJoinAndSelect("classList.classListDiv", "classListDiv")
      .leftJoinAndSelect("classListDiv.classDiv", "cClassDiv")
      .leftJoinAndSelect("classListDiv.subject", "csubject")
      .leftJoinAndSelect("classListDiv.staffDetail", "staffDetail")
      .leftJoinAndSelect("classListDiv.coOrdinator", "coOrdinator")
      .leftJoinAndSelect(
        "setting.department",
        "department",
        "department.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect(
        "setting.designation",
        "designation",
        "designation.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect("designation.idCardsStock", "dIdCardsStock")
      .leftJoinAndSelect("dIdCardsStock.productImage", "dproductImage")
      .leftJoinAndSelect(
        "setting.houseZone",
        "houseZone",
        "houseZone.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .leftJoinAndSelect("houseZone.idCardsStock", "hIdCardsStock")
      .leftJoinAndSelect("hIdCardsStock.productImage", "hproductImage")
      .leftJoinAndSelect(
        "setting.subject",
        "subject",
        "subject.status = :status",
        { status: DefaultStatus.ACTIVE }
      )
      .select([
        "setting.id",
        "setting.type",
        "setting.csvFields",
        "setting.staffCsvFields",

        "bookCategory.id",
        "bookCategory.name",

        "classDiv.id",
        "classDiv.name",
        "classDiv.priority",

        "classList.id",
        "classList.name",
        "classList.priority",

        "classListDiv.id",
        "classListDiv.time_end",
        "classListDiv.time_start",
        "classListDiv.type",

        "cClassDiv.id",
        "cClassDiv.name",
        "cClassDiv.priority",

        "csubject.id",
        "csubject.name",

        "staffDetail.id",
        "staffDetail.name",

        "coOrdinator.id",
        "coOrdinator.name",

        "department.id",
        "department.name",

        "designation.id",
        "designation.name",
        "designation.priority",

        "houseZone.id",
        "houseZone.name",

        "subject.id",
        "subject.name",

        "idCardsStock.id",
        "idCardsStock.title",
        "productImage.file",

        "dIdCardsStock.id",
        "dIdCardsStock.title",
        "dproductImage.file",

        "pIdCardsStock.id",
        "pIdCardsStock.title",
        "pproductImage.file",

        "hIdCardsStock.id",
        "hIdCardsStock.title",
        "hproductImage.file",
      ])
      .where("setting.id = :id", { id: id })
      .getOne();

    if (!result) {
      throw new NotFoundException('Setting not found!');
    }

    return result;
  }

  async update(id: string, dto: UpdateSettingDto) {
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException('Setting  not Found !');
    }
    const object = Object.assign(result, dto);
    return this.repo.save(object);
  }
}
