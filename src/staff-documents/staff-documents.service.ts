import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStatusDto } from 'src/common/dto/document-status.dto';
import { DocumentType } from 'src/enum';
import { StaffDetailsService } from 'src/staff-details/staff-details.service';
import { Repository } from 'typeorm';
import { StaffDocument } from './entities/staff-document.entity';

@Injectable()
export class StaffDocumentsService {
  constructor(
    @InjectRepository(StaffDocument)
    private readonly repo: Repository<StaffDocument>,
    private readonly staffDetailsService: StaffDetailsService,
  ) { }

  create(
    image: string,
    type: string,
    staffDetailId: string,
    updatedId: string,
    accountId: string,
  ) {
    const obj = Object.create({
      url: process.env.HOC_CDN_LINK + image,
      name: image,
      type,
      staffDetailId,
      accountId: updatedId,
      updatedId: updatedId,
    });
    this.staffDetailsService.delStaffDetail(accountId);
    return this.repo.save(obj);
  }

  async findOneByAccount(staffDetailId: string, type: DocumentType) {
    const result = await this.repo.findOne({ where: { staffDetailId, type } });
    if (result) {
      throw new ConflictException('Document already exists!');
    }
    return result;
  }

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Document not found!');
    }
    return result;
  }

  async status(id: string, dto: DocumentStatusDto, accountId: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Document not found!');
    }
    this.staffDetailsService.delStaffDetail(accountId);
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
