import { Account } from '../../account/entities/account.entity';
import { ClassDiv } from '../../class-div/entities/class-div.entity';
import { ClassList } from '../../class-list/entities/class-list.entity';
import { AttendanceStatus } from '../../enum';
import { OrganizationDetail } from '../../organization-details/entities/organization-detail.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StudentAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  updatedId: string;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @Column({ type: 'uuid', nullable: true })
  organizationDetailId: string;

  @Column({ type: 'uuid', nullable: true })
  studentId: string;

  @Column({ type: 'uuid', nullable: true })
  subjectId: string;

  @Column({ type: 'uuid', nullable: true })
  classListId: string;

  @Column({ type: 'uuid', nullable: true })
  classDivId: string;

  @ManyToOne(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.studentAttendance,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  organizationDetail: OrganizationDetail[];

  @ManyToOne(() => Setting, (setting) => setting.studentAttendance, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.studentAttendance, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Student, (student) => student.studentAttendance, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  student: Student[];

  @ManyToOne(() => Subject, (subject) => subject.studentAttendance, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  subject: Subject[];

  @ManyToOne(() => ClassList, (classList) => classList.studentAttendance, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  classList: ClassList[];

  @ManyToOne(() => ClassDiv, (classDiv) => classDiv.studentAttendance, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  classDiv: ClassDiv[];
}
