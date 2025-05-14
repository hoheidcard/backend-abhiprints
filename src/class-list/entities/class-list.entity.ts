import { Account } from "src/account/entities/account.entity";
import { Book } from "src/books/entities/book.entity";
import { CardOrderList } from "src/card-orders/entities/card-order-list.entity";
import { DefaultStatus, SideType } from "src/enum";
import { IdCardsStock } from "src/id-cards-stock/entities/id-cards-stock.entity";
import { Setting } from "src/settings/entities/setting.entity";
import { StudentAttendance } from "src/student-attendance/entities/student-attendance.entity";
import { Student } from "src/students/entities/student.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ClassListDiv } from "./class-list-div.entity";

@Entity()
export class ClassList {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  name: string;

  @Column({ type: "int", default: 0 })
  priority: number;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: "text", nullable: true })
  card: string;

  @Column({ type: "text", nullable: true })
  pcard: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @Column({ type: "uuid", nullable: true })
  updatedId: string;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @Column({ type: "uuid", nullable: true })
  idCardsStockId: string;

  @Column({ type: "uuid", nullable: true })
  pIdCardsStockId: string;

  @ManyToOne(() => IdCardsStock, (idCardsStock) => idCardsStock.classList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  idCardsStock: IdCardsStock[];

  @ManyToOne(() => IdCardsStock, (pIdCardsStock) => pIdCardsStock.classList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  pIdCardsStock: IdCardsStock[];

  @ManyToOne(() => Setting, (setting) => setting.classList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.classList, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @OneToMany(() => Book, (book) => book.classList)
  book: Book[];

  @OneToMany(() => Student, (student) => student.classList)
  student: Student[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.classList
  )
  studentAttendance: StudentAttendance[];

  @OneToMany(() => ClassListDiv, (classListDiv) => classListDiv.classList)
  classListDiv: ClassListDiv[];

  @OneToMany(() => CardOrderList, (cardOrderList) => cardOrderList.classList)
  cardOrderList: CardOrderList[];
}
