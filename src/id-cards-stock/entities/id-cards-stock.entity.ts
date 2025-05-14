import { CartProduct } from "src/cart-product/entities/cart-product.entity";
import { Category } from "src/category/entities/category.entity";
import { ClassList } from "src/class-list/entities/class-list.entity";
import { Designation } from "src/designation/entities/designation.entity";
import { DefaultStatus, SideType } from "src/enum";
import { HouseZone } from "src/house-zones/entities/house-zone.entity";
import { ProductImage } from "src/product-images/entities/product-image.entity";
import { ProductVariant } from "src/product-variants/entities/product-variant.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class IdCardsStock {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  code: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  desc: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  shortDesc: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  image: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  imageName: string;

  @Column({ type: "float", default: 0 })
  price: number;

  @Column({ type: "float", default: 0 })
  discount: number;

  @Column({ type: "float", default: 0 })
  discountedPrice: number;

  @Column({ type: "float", default: 0 })
  finalPrice: number;

  @Column({ type: "float", default: 0 })
  partnerDiscount: number;

  @Column({ type: "float", default: 0 })
  additionalDiscount: number;

  @Column({ type: "text", nullable: true })
  card: string;

  // @Column({ type: "text", nullable: true })
  // backCardImage: string;

  // @Column({ type: "text", nullable: true })
  // frontCard: string;

  // @Column({ type: "text", nullable: true })
  // frontCardImage: string;

  // @Column({ type: "float", default: 0 })
  // cardHeight: number;

  // @Column({ type: "float", default: 0 })
  // cardWidth: number;

  // @Column({ type: "float", default: 0 })
  // cardVerticalGap: number;

  // @Column({ type: "float", default: 0 })
  // cardHorizontalGap: number;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  // @Column({ type: "enum", enum: SideType, default: SideType.SINGLE })
  // side: SideType;

  // @Column({ type: "varchar", length: 30, nullable: true })
  // type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.idCardsStock, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  category: Category[];

  @OneToMany(() => ClassList, (classList) => classList.idCardsStock)
  classList: ClassList[];

  @OneToMany(() => Designation, (designation) => designation.idCardsStock)
  designation: Designation[];

  @OneToMany(() => HouseZone, (houseZone) => houseZone.idCardsStock)
  houseZone: HouseZone[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.idCardsStock)
  cartProduct: CartProduct[];

  @OneToMany(
    () => ProductVariant,
    (productVariant) => productVariant.idCardsStock
  )
  productVariant: ProductVariant[];

  @OneToMany(() => ProductImage, (productImage) => productImage.idCardsStock)
  productImage: ProductImage[];
}
