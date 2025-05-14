import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardOrderList } from './card-order-list.entity';
import { CardOrder } from './card-order.entity';

@Entity()
export class CardStudent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  studentId: string;

  @Column({ type: "uuid", nullable: true })
  cardOrderListId: string;

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

  @ManyToOne(() => CardOrder, (cardOrder) => cardOrder.cardStudent, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  cardOrder: CardOrder[];

  @ManyToOne(() => Student, (student) => student.cardStudent, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  student: Student[];

  @ManyToOne(
    () => CardOrderList,
    (cardOrderList) => cardOrderList.cardStudent,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  cardOrderList: CardOrderList[];
}
