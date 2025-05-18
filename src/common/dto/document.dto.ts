import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentType } from '../../enum';

export class DocumentDto {
  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  documentId: string;
}
