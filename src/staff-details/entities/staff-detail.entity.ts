import { Account } from "../../account/entities/account.entity";
import { CardOrderList } from "../../card-orders/entities/card-order-list.entity";
import { ClassListDiv } from "../../class-list/entities/class-list-div.entity";
import { Designation } from "../../designation/entities/designation.entity";
import { DefaultStatus, Gender, YNStatus } from "../../enum";
import { OrganizationDetail } from "../../organization-details/entities/organization-detail.entity";
import { PartnerDetail } from "../../partner-details/entities/partner-detail.entity";
import { Setting } from "../../settings/entities/setting.entity";
import { StaffDepartment } from "../../staff-department/entities/staff-department.entity";
import { StaffDocument } from "../../staff-documents/entities/staff-document.entity";
import { StaffSubject } from "../../staff-subject/entities/staff-subject.entity";
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
export class StaffDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // 0 - Remainin, 1 - Printed, 2 - Card Reprinted
  @Column({ type: "int", default: 0 })
  card: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  employeeId: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  rfidNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  emailId: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  aadharNumber: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  cast: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  photoNumber: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  religion: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  nationality: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  contactNo: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  altContactNo: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  address: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  state: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  pincode: string;

  @Column({ type: "text", nullable: true })
  profile: string;

  @Column({ type: "text", nullable: true })
  profileName: string;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: "date", nullable: true })
  dob: Date;

  @Column({ type: "date", nullable: true })
  joiningDate: Date;

  @Column({ type: "varchar", length: 100, nullable: true })
  spouseName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  spouseContactNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  spouseOccupation: string;

  @Column({ type: "int", default: 0 })
  spouseIncome: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianRelation: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianContactNo: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  guardianOccupation: string;

  @Column({ type: "int", default: 0 })
  guardianIncome: number;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  transport: YNStatus;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  canteen: YNStatus;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  library: YNStatus;

  @Column({ type: "enum", enum: YNStatus, nullable: true })
  hostel: YNStatus;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @Column({ type: "uuid", nullable: true })
  designationId: string;

  @Column({ type: "uuid", nullable: true })
  updatedId: string;

  @Column({ type: "uuid", nullable: true })
  organizationDetailId: string;

  @Column({ type: "uuid", nullable: true })
  partnerDetailId: string;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @ManyToOne(() => Designation, (designation) => designation.staffDetail, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  designation: Designation[];

  @ManyToOne(() => Setting, (setting) => setting.staffDetail, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @ManyToOne(
    () => PartnerDetail,
    (partnerDetail) => partnerDetail.staffDetail,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  partnerDetail: PartnerDetail[];

  @OneToMany(() => StaffDocument, (staffDocument) => staffDocument.staffDetail)
  staffDocument: StaffDocument[];

  @ManyToOne(() => Account, (account) => account.staffDetail, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];

  @ManyToOne(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.staffDetail,
    {
      cascade: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }
  )
  organizationDetail: OrganizationDetail[];

  @OneToMany(() => StaffSubject, (staffSubject) => staffSubject.staffDetail)
  staffSubject: StaffSubject[];

  @OneToMany(
    () => StaffDepartment,
    (staffDepartment) => staffDepartment.staffDetail
  )
  staffDepartment: StaffDepartment[];

  @OneToMany(() => ClassListDiv, (classListDiv) => classListDiv.staffDetail)
  classListDiv: ClassListDiv[];

  @OneToMany(() => ClassListDiv, (coOrdinator) => coOrdinator.staffDetail)
  coOrdinator: ClassListDiv[];

  @OneToMany(() => CardOrderList, (cardOrderList) => cardOrderList.staffDetail)
  cardOrderList: CardOrderList[];
}
