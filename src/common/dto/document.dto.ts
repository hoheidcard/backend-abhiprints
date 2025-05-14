import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DocumentType } from 'src/enum';

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
