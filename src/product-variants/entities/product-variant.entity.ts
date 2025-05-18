// import { CartProductVariant } from '../../cart-product/entities/cart-product-variant.entity';
import { CartProductVariant } from '../../cart-product/entities/cart-product-variant.entity';
import { VariantType } from '../../enum';
import { IdCardsStock } from '../../id-cards-stock/entities/id-cards-stock.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'enum', enum: VariantType, default: VariantType.SIZE })
  type: VariantType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid' })
  idCardsStockId: string;

  @ManyToOne(() => IdCardsStock, (idCardsStock) => idCardsStock.productVariant, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  idCardsStock: IdCardsStock[];

  @OneToMany(
    () => CartProductVariant,
    (cartProductVariant) => cartProductVariant.productVariant,
  )
  cartProductVariant: CartProductVariant[];
}
