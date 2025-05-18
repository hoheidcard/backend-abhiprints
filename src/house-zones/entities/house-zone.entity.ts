import { Account } from "../../account/entities/account.entity";
import { DefaultStatus, SideType } from "../../enum";
import { IdCardsStock } from "../../id-cards-stock/entities/id-cards-stock.entity";
import { Setting } from "../../settings/entities/setting.entity";
import { Student } from "../../students/entities/student.entity";
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
export class HouseZone {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  name: string;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: "text", nullable: true })
  card: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @Column({ type: "uuid", nullable: true })
  updatedId: string;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @Column({ type: "uuid", nullable: true })
  idCardsStockId: string;

  @ManyToOne(() => IdCardsStock, (idCardsStock) => idCardsStock.houseZone, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  idCardsStock: IdCardsStock[];

  @ManyToOne(() => Setting, (setting) => setting.houseZone, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.houseZone, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @OneToMany(() => Student, (student) => student.houseZone)
  student: Student[];
}
