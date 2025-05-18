import { Account } from "../../account/entities/account.entity";
import { Cart } from "../../carts/entities/cart.entity";
import { IdCardsStock } from "../../id-cards-stock/entities/id-cards-stock.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CartProductVariant } from "./cart-product-variant.entity";
import { CartStatus } from "../../enum";
import { Setting } from "../../settings/entities/setting.entity";

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.CART })
  status: CartStatus;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "uuid", nullable: true })
  cartId: string;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @Column({ type: "uuid", nullable: true })
  idCardsStockId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Setting, (setting) => setting.cartProduct, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(() => Cart, (cart) => cart.cartProduct, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  cart: Cart[];

  @ManyToOne(() => Account, (account) => account.cartProduct, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @ManyToOne(() => IdCardsStock, (idCardsStock) => idCardsStock.cartProduct, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  idCardsStock: IdCardsStock[];

  @OneToMany(
    () => CartProductVariant,
    (cartProductVariant) => cartProductVariant.cartProduct
  )
  cartProductVariant: CartProductVariant[];
}
