import { Injectable } from '@nestjs/common';
import { CreateSubPartnerDetailDto } from './dto/create-sub-partner-detail.dto';
import { UpdateSubPartnerDetailDto } from './dto/update-sub-partner-detail.dto';

@Injectable()
export class SubPartnerDetailsService {
  create(createSubPartnerDetailDto: CreateSubPartnerDetailDto) {
    return 'This action adds a new subPartnerDetail';
  }

  findAll() {
    return `This action returns all subPartnerDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subPartnerDetail`;
  }

  update(id: number, updateSubPartnerDetailDto: UpdateSubPartnerDetailDto) {
    return `This action updates a #${id} subPartnerDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} subPartnerDetail`;
  }
}
