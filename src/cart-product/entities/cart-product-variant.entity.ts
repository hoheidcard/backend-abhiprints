import { ProductVariant } from "../../product-variants/entities/product-variant.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartProduct } from "./cart-product.entity";

@Entity()
export class CartProductVariant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  cartProductId: string;

  @Column({ type: "uuid", nullable: true })
  productVariantId: string;

  @ManyToOne(
    () => CartProduct,
    (cartProduct) => cartProduct.cartProductVariant,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  cartProduct: CartProduct;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.cartProductVariant,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  productVariant: ProductVariant;
}
