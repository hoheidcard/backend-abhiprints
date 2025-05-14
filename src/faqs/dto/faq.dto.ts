import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FaqDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  question: string;

  @IsOptional()
  @IsUUID()
  accountId: string;
}

export class FaqAnswerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(3000)
  answer: string;

  @IsOptional()
  @IsUUID()
  updatedId: string;
}
