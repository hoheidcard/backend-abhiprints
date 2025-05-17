import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStatusDto } from '../common/dto/document-status.dto';
import { DocumentType } from 'src/enum';
import { Repository } from 'typeorm';
import { PartnerDocument } from './entities/partner-document.entity';

@Injectable()
export class PartnerDocumentsService {
  constructor(
    @InjectRepository(PartnerDocument)
    private readonly repo: Repository<PartnerDocument>,
  ) {}

  create(
    image: string,
    type: string,
    staffDetailId: string,
    updatedId: string,
  ) {
    const obj = Object.create({
      url: process.env.HOC_CDN_LINK + image,
      name: image,
      type,
      staffDetailId,
      accountId: updatedId,
      updatedId: updatedId,
    });
    return this.repo.save(obj);
  }

  async findOneByAccount(partnerDetailId: string, type: DocumentType) {
    const result = await this.repo.findOne({
      where: { partnerDetailId, type },
    });
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
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
