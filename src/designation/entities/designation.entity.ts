import { DesignationPermission } from "src/designation-permission/entities/designation-permission.entity";
import { DefaultStatus, SideType } from "src/enum";
import { IdCardsStock } from "src/id-cards-stock/entities/id-cards-stock.entity";
import { Setting } from "src/settings/entities/setting.entity";
import { StaffDetail } from "src/staff-details/entities/staff-detail.entity";
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
export class Designation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  name: string;

  @Column({ type: "int", default: 0 })
  priority: number;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: "text", nullable: true })
  card: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @Column({ type: "uuid", nullable: true })
  idCardsStockId: string;

  @ManyToOne(() => IdCardsStock, (idCardsStock) => idCardsStock.designation, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  idCardsStock: IdCardsStock[];

  @ManyToOne(() => Setting, (setting) => setting.designation, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @OneToMany(() => StaffDetail, (staffDetail) => staffDetail.designation)
  staffDetail: StaffDetail[];

  @OneToMany(
    () => DesignationPermission,
    (designationPermission) => designationPermission.designation
  )
  designationPermission: DesignationPermission[];
}
