import { Account } from "../../account/entities/account.entity";
import { DeliveryPartner } from "../../delivery-partners/entities/delivery-partner.entity";
import { OrderStatus, OrderType } from "../../enum";
import { Setting } from "../../settings/entities/setting.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CardOrderList } from "./card-order-list.entity";
import { CardStudent } from "./card-students.entity";

@Entity()
export class CardOrder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 1 })
  orderNumber: number;

  @Column({ type: "int", default: 1 })
  qty: number;

  @Column({ type: "varchar", length: 20, nullable: true })
  contactNumber: string;

  @Column({ type: "date", nullable: true })
  orderDate: Date;

  @Column({ type: "date", nullable: true })
  deliveryDate: Date;

  @Column({ type: "year", nullable: true })
  fromYear: number;

  @Column({ type: "year", nullable: true })
  toYear: number;

  @Column({ type: "varchar", length: 250, nullable: true })
  deliveryAddress: string;

  @Column({ type: "boolean", default: false })
  parentCard: boolean;

  @Column({ type: "uuid", nullable: true })
  deliveryPartnerId: string;

  @Column({ type: "uuid", nullable: true })
  staffAccountId: string;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @Column({ type: "uuid", nullable: true })
  subPartnerAccountId: string;

  @Column({ type: "uuid", nullable: true })
  partnerAccountId: string;

  @Column({ type: "uuid", nullable: true })
  adminAccountId: string;

  @Column({ type: "enum", enum: OrderType, nullable: true })
  type: OrderType;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (staffAccount) => staffAccount.cardOrder, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  staffAccount: Account[];

  @ManyToOne(
    () => DeliveryPartner,
    (deliveryPartner) => deliveryPartner.cardOrder,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  deliveryPartner: DeliveryPartner[];

  @ManyToOne(() => Setting, (setting) => setting.cardOrder, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(
    () => Account,
    (subPartnerAccount) => subPartnerAccount.cardOrder,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  subPartnerAccount: Account[];

  @ManyToOne(() => Account, (partnerAccount) => partnerAccount.cardOrder, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  partnerAccount: Account[];

  @ManyToOne(() => Account, (adminAccount) => adminAccount.cardOrder, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  adminAccount: Account[];

  @ManyToOne(() => Account, (account) => account.cardOrder, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @OneToMany(() => CardOrderList, (cardOrderList) => cardOrderList.cardOrder)
  cardOrderList: CardOrderList[];

  @OneToMany(() => CardStudent, (cardStudent) => cardStudent.cardOrder)
  cardStudent: CardStudent[];
}
