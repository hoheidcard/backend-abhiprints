import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { VariantType } from "../../enum";

export class ProductVariantDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEnum(VariantType)
  type: VariantType;

  @IsOptional() 
  idCardsStockId: string;
}
