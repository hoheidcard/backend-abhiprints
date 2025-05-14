import { Account } from 'src/account/entities/account.entity';
import { Book } from 'src/books/entities/book.entity';
import { BranchType, DefaultStatus } from 'src/enum';
import { EventOrganization } from 'src/event-organizations/entities/event-organization.entity';
import { Notice } from 'src/notices/entities/notice.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import { StudentAttendance } from 'src/student-attendance/entities/student-attendance.entity';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrganizationDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pincode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactNo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  imageName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  whatsApp: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  numberOfBranch: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerMobile: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerWhatsApp: string;

  @Column({ type: 'enum', enum: BranchType, default: BranchType.BRANCH })
  type: BranchType;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

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
  organizationId: string;

  @ManyToOne(() => Account, (account) => account.organizationDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Account, (updated) => updated.organizationDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  updated: Account[];

  @ManyToOne(() => Setting, (setting) => setting.organizationDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @OneToMany(() => StaffDetail, (staffDetail) => staffDetail.organizationDetail)
  staffDetail: StaffDetail[];

  @OneToMany(() => Student, (student) => student.organizationDetail)
  student: Student[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.organizationDetail,
  )
  studentAttendance: StudentAttendance[];

  @OneToMany(() => Book, (book) => book.organizationDetail)
  book: Book[];

  @OneToMany(() => Notice, (notice) => notice.organizationDetail)
  notice: Notice[];

  @OneToMany(
    () => EventOrganization,
    (eventOrganization) => eventOrganization.organizationDetail,
  )
  eventOrganization: EventOrganization[];
}
