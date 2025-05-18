import { Account } from '../../account/entities/account.entity';
import { CartProduct } from '../../cart-product/entities/cart-product.entity';
import { CartStatus, UserRole } from '../../enum';
import { PaymentHistory } from '../../payment-history/entities/payment-history.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { UserAddress } from '../../user-address/entities/user-address.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.CART })
  status: CartStatus;

  @Column({ type: "enum", enum: UserRole, default: UserRole.SCHOOL })
  roles: UserRole;

  @Column({ type: 'varchar', length: 100, nullable: true })
  orderId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoiceNumber: string;

  @Column({ type: 'double', default:0 })
  total: number;

  @Column({ type: 'double', default:0 })
  cgst: number;

  @Column({ type: 'double', default:0 })
  igst: number;

  @Column({ type: 'double', default:0 })
  sgst: number;

  @Column({ type: 'double', default:0 })
  shipping: number;

  @Column({ type: 'double', default:0 })
  addDiscount: number;

  @Column({ type: 'date', nullable: true })
  orderDate: Date;

  @Column({ type: 'date', nullable: true })
  cancelDate: Date;

  @Column({ type: 'date', nullable: true })
  pickupDate: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  track: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @Column({ type: 'uuid', nullable: true })
  userAddressId: string;

  @Column({ type: 'uuid', nullable: true })
  subPartnerAccountId: string;

  @Column({ type: "uuid", nullable: true })
  partnerAccountId: string;

  @Column({ type: "uuid", nullable: true })
  adminAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Setting, (setting) => setting.cart, {
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

  @ManyToOne(() => Account, (account) => account.cart, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => UserAddress, (userAddress) => userAddress.cart, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userAddress: UserAddress[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProduct: CartProduct[];

  @OneToOne(() => PaymentHistory, (paymentHistory) => paymentHistory.cart)
  @JoinTable()
  paymentHistory: PaymentHistory;
}
