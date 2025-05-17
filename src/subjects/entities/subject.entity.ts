import { Account } from "../../account/entities/account.entity";
import { ClassListDiv } from "../../class-list/entities/class-list-div.entity";
import { DefaultStatus } from "../../enum";
import { Setting } from "../../settings/entities/setting.entity";
import { StaffSubject } from "../../staff-subject/entities/staff-subject.entity";
import { StudentAttendance } from "../../student-attendance/entities/student-attendance.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Subject {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  name: string;

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

  @ManyToOne(() => Setting, (setting) => setting.subject, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.subject, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @OneToMany(() => StaffSubject, (staffSubject) => staffSubject.subject)
  staffSubject: StaffSubject[];

  @OneToMany(() => ClassListDiv, (classListDiv) => classListDiv.subject)
  classListDiv: ClassListDiv[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.subject
  )
  studentAttendance: StudentAttendance[];
}
