import { PartialType } from '@nestjs/swagger';
import { CreateSubPartnerDetailDto } from './create-sub-partner-detail.dto';

export class UpdateSubPartnerDetailDto extends PartialType(CreateSubPartnerDetailDto) {}
