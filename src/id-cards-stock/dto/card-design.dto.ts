import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { ProductVariantDto } from "../../product-variants/dto/product-variant.dto";

export class ProductDetailDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  shortDesc: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  desc: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100000000000)
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100000000000)
  discountedPrice: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100000000000)
  finalPrice: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  partnerDiscount: number;

  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // @Max(100)
  // additionalDiscount: number;

  @IsNotEmpty()
  @IsArray()
  productVariant: ProductVariantDto[];

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}

export class EditorDesignDto {
  @IsOptional()
  @MinLength(0)
  @MaxLength(100000)
  card: string;

  // @IsOptional()
  // @MinLength(0)
  // @MaxLength(1000)
  // backCardImage: string;

  // @IsOptional()
  // @MinLength(0)
  // @MaxLength(10000)
  // frontCard: string;

  // @IsOptional()
  // @MinLength(0)
  // @MaxLength(1000)
  // frontCardImage: string;

  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // cardHeight: number;

  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // cardWidth: number;

  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // cardVerticalGap: number;

  // @IsNotEmpty()
  // @Type(() => Number)
  // @IsNumber()
  // cardHorizontalGap: number;

  // @IsOptional()
  // type: string;
}
