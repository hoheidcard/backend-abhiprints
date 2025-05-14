import { PartialType } from '@nestjs/swagger';
import { CreatePartnerDocumentDto } from './create-partner-document.dto';

export class UpdatePartnerDocumentDto extends PartialType(CreatePartnerDocumentDto) {}
