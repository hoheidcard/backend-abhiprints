import { Account } from "../../account/entities/account.entity";
import { Cart } from "../../carts/entities/cart.entity";
import { DefaultStatus } from "../../enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  altPhone: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  state: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  pincode: string;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({
    type: "enum",
    enum: DefaultStatus,
    default: DefaultStatus.DEACTIVE,
  })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.userAddress, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @ManyToOne(() => Cart, (cart) => cart.userAddress)
  cart: Cart[];
}
