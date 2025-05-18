import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentStatus } from '../../enum';


export class DocumentStatusDto {
  @IsNotEmpty()
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  // only for backend use
  @IsOptional()
  @IsUUID()
  updatedId: string;
}
