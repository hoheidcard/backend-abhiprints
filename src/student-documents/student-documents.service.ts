import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentStatusDto } from '../common/dto/document-status.dto';
import { DocumentType } from 'src/enum';
import { Repository } from 'typeorm';
import { StudentDocument } from './entities/student-document.entity';

@Injectable()
export class StudentDocumentsService {
  constructor(
    @InjectRepository(StudentDocument)
    private readonly repo: Repository<StudentDocument>,
  ) {}

  create(image: string, type: string, studentId: string, updatedId: string) {
    const obj = Object.create({
      url: process.env.HOC_CDN_LINK + image,
      name: image,
      type,
      studentId,
      accountId: updatedId,
      updatedId: updatedId,
    });
    return this.repo.save(obj);
  }

  async findOneByAccount(studentId: string, type: DocumentType) {
    const result = await this.repo.findOne({ where: { studentId, type } });
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

  async status(id: string, dto: DocumentStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Document not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
