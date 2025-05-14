import { Account } from "src/account/entities/account.entity";
import { ClassListDiv } from "src/class-list/entities/class-list-div.entity";
import { DefaultStatus } from "src/enum";
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

@Entity()
export class ClassDiv {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  name: string;

  @Column({ type: "int", default: 0 })
  priority: number;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

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

  @ManyToOne(() => Setting, (setting) => setting.classDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.classDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @OneToMany(() => Student, (student) => student.classDiv)
  student: Student[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.classDiv
  )
  studentAttendance: StudentAttendance[];

  @OneToMany(() => ClassListDiv, (classListDiv) => classListDiv.classDiv)
  classListDiv: ClassListDiv[];
}
