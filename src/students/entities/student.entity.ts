import { Account } from '../../account/entities/account.entity';
import { CardStudent } from '../../card-orders/entities/card-students.entity';
import { ClassDiv } from '../../class-div/entities/class-div.entity';
import { ClassList } from '../../class-list/entities/class-list.entity';
import { DefaultStatus, Gender, Stream, YNStatus } from '../../enum';
import { HouseZone } from '../../house-zones/entities/house-zone.entity';
import { OrganizationDetail } from '../../organization-details/entities/organization-detail.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { StudentAttendance } from '../../student-attendance/entities/student-attendance.entity';
import { StudentDocument } from '../../student-documents/entities/student-document.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  regNo: string;

  @Column({ type: "bigint", nullable: true })
  srNo: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  UID: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  PEN: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  photoNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  fphotoNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  mphotoNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  gphotoNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  studentNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  admissionNo: string;

  @Column({ type: "int", nullable: true })
  rollNo: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  rfidNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  aadharNumber: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  emailId: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianRelation: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  cast: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  religion: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  nationality: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  contactNo: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  altContactNo: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  emergencyNumber: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  bloodGroup: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  address: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  state: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  pincode: string;

  @Column({ type: "text", nullable: true })
  profile: string;

  @Column({ type: "text", nullable: true })
  profileName: string;

  @Column({ type: "text", nullable: true })
  fatherImage: string;

  @Column({ type: "text", nullable: true })
  fatherImageName: string;

  @Column({ type: "text", nullable: true })
  motherImage: string;

  @Column({ type: "text", nullable: true })
  motherImageName: string;

  @Column({ type: "text", nullable: true })
  guardianImage: string;

  @Column({ type: "text", nullable: true })
  guardianImageName: string;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: "date", nullable: true })
  dob: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  fatherName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  fatherContactNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  fatherOccupation: string;

  @Column({ type: "int", nullable: true })
  fatherIncome: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  motherName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  motherContactNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  motherOccupation: string;

  @Column({ type: "int", nullable: true })
  motherIncome: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianContactNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianOccupation: string;

  @Column({ type: "int", nullable: true })
  guardianIncome: number;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  transport: YNStatus;

  @Column({ type: "enum", enum: Stream, nullable: true })
  stream: Stream;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  canteen: YNStatus;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  library: YNStatus;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  hostel: YNStatus;

  // 0 - Remainin, 1 - Process, 2 - Printed, 3 - Reprinted
  @Column({ type: "int", default: 0 })
  card: number;

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
  organizationDetailId: string;

  @Column({ type: "uuid", nullable: true })
  classListId: string;

  @Column({ type: "uuid", nullable: true })
  classDivId: string;

  @Column({ type: "uuid", nullable: true })
  houseZoneId: string;

  @ManyToOne(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.student,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  organizationDetail: OrganizationDetail[];

  @ManyToOne(() => ClassDiv, (classDiv) => classDiv.student, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  classDiv: ClassDiv[];

  @ManyToOne(() => ClassList, (classList) => classList.student, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  classList: ClassList[];

  @ManyToOne(() => HouseZone, (houseZone) => houseZone.student, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  houseZone: HouseZone[];

  @ManyToOne(() => Setting, (setting) => setting.student, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.student, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];
  @OneToMany(
    () => StudentDocument,
    (studentDocument) => studentDocument.student
  )
  studentDocument: StudentDocument[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.student
  )
  studentAttendance: StudentAttendance[];

@OneToMany(() => CardStudent, (cardStudent: CardStudent) => cardStudent.student)
cardStudents: CardStudent[];

  cardStudent: CardStudent[];
}
