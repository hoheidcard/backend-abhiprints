import { ClassDiv } from "../../class-div/entities/class-div.entity";
import { StaffDetail } from "../../staff-details/entities/staff-detail.entity";
import { Subject } from "../../subjects/entities/subject.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TeacherType } from "./../../enum";
import { ClassList } from "./class-list.entity";

@Entity()
export class ClassListDiv {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "time", nullable: true })
  time_start: Date;

  @Column({ type: "time", nullable: true })
  time_end: Date;

  @Column({ type: "enum", enum: TeacherType, nullable: true })
  type: TeacherType;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  classListId: string;

  @Column({ type: "uuid", nullable: true })
  classDivId: string;

  @Column({ type: "uuid", nullable: true })
  staffDetailId: string;

  @Column({ type: "uuid", nullable: true })
  coOrdinatorId: string;

  @Column({ type: "uuid", nullable: true })
  subjectId: string;

  @ManyToOne(() => ClassList, (classList) => classList.classListDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  classList: ClassList[];

  @ManyToOne(() => ClassDiv, (classDiv) => classDiv.classListDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  classDiv: ClassDiv[];

  @ManyToOne(() => Subject, (subject) => subject.classListDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  subject: Subject[];

  @ManyToOne(() => StaffDetail, (staffDetail) => staffDetail.classListDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  staffDetail: StaffDetail[];

  @ManyToOne(() => StaffDetail, (coOrdinator) => coOrdinator.classListDiv, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  coOrdinator: StaffDetail[];
}
