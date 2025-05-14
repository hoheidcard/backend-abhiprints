import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CartVariant {
  @IsOptional()
  @IsUUID()
  productVariantId: string;

  // Only for backend
  @IsOptional()
  @IsUUID()
  cartProductId: string;
}

export class CartProductDto {
  @IsNotEmpty()
  @IsUUID()
  idCardsStockId: string;

  @IsOptional()
  @IsArray()
  productVariant: CartVariant[];

  @IsOptional()
  @IsNumber()
  quantity: number;

  // Backend use only
  @IsOptional()
  accountId: string;

  @IsOptional()
  cartId: string;

  @IsOptional()
  settingId: string;
}
