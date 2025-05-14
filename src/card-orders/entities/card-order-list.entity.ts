import { ClassList } from 'src/class-list/entities/class-list.entity';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardOrder } from './card-order.entity';
import { CardStudent } from './card-students.entity';

@Entity()
export class CardOrderList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  staffDetailId: string;

  @Column({ type: "uuid", nullable: true })
  classListId: string;

  @Column({ type: "uuid", nullable: true })
  cardOrderId: string;

  @Column({ type: "year", nullable: true })
  fromYear: number;

  @Column({ type: "year", nullable: true })
  toYear: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ClassList, (classList) => classList.cardOrderList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  classList: ClassList[];

  @ManyToOne(() => StaffDetail, (staffDetail) => staffDetail.cardOrderList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  staffDetail: StaffDetail[];

  @ManyToOne(() => CardOrder, (cardOrder) => cardOrder.cardOrderList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  cardOrder: CardOrder[];

  @OneToMany(() => CardStudent, (cardStudent) => cardStudent.cardOrderList)
  cardStudent: CardStudent[];
}
