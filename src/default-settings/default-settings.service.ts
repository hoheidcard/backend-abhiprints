import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DefaultSettingFor, DefaultSettingType } from "../enum";
import { Not, Repository } from "typeorm";
import {
  BulkDefaultSettingDto,
  CreateDefaultSettingDto,
  UpdateDefaultSettingDto,
} from "./dto/default-setting.dto";
import { DefaultSetting } from "./entities/default-setting.entity";

@Injectable()
export class DefaultSettingsService {
  constructor(
    @InjectRepository(DefaultSetting)
    private readonly repo: Repository<DefaultSetting>
  ) {}

  async create(dto: CreateDefaultSettingDto) {
    const result = await this.repo.findOne({
      where: [
        {
          name: dto.name,
          type: dto.type,
          for: dto.for,
        },
        {
          priority: dto.priority,
          type: dto.type,
          for: dto.for,
        },
      ],
    });
    if (result) {
      throw new ConflictException("Name or priority already exists!");
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(
    defaultSettingType: DefaultSettingType,
    defaultSettingFor: DefaultSettingFor
  ) {
    // return this.repo.find({
    //   where: { type: defaultSettingType, for: defaultSettingFor },
    // });
    const [result, total] = await this.repo
      .createQueryBuilder("defaultSetting")
      // .select(['designation.id', 'designation.name', 'designation.priority'])
      .where("defaultSetting.type = :type AND defaultSetting.for = :for", {
        type: defaultSettingType,
        for: defaultSettingFor,
      })
      .orderBy({ "defaultSetting.priority": "ASC" })
      .getManyAndCount();

    return { result, total };
  }

  async updatePriority(dto: BulkDefaultSettingDto[]) {
    const result = await this.repo.save(dto);
  }

  async update(id: number, dto: UpdateDefaultSettingDto) {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException("Not found!");
    }
    const check = await this.repo.findOne({
      where: [
        {
          name: dto.name,
          type: result.type,
          for: result.for,
          id: Not(id),
        },
        {
          priority: dto.priority,
          type: result.type,
          for: result.for,
          id: Not(id),
        },
      ],
    });
    if (check) {
      throw new ConflictException("Name or priority already exists!");
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async remove(id: number) {
    const result = await this.repo.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException("Not found!");
    }
    return this.repo.remove(result);
  }
}
