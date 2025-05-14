import { Account } from "src/account/entities/account.entity";
import { BookCategory } from "src/book-category/entities/book-category.entity";
import { Book } from "src/books/entities/book.entity";
import { CardOrder } from "src/card-orders/entities/card-order.entity";
import { CartProduct } from "src/cart-product/entities/cart-product.entity";
import { Cart } from "src/carts/entities/cart.entity";
import { ClassDiv } from "src/class-div/entities/class-div.entity";
import { ClassList } from "src/class-list/entities/class-list.entity";
import { Department } from "src/departments/entities/department.entity";
import { Designation } from "src/designation/entities/designation.entity";
import { SMType } from "src/enum";
import { Event } from "src/events/entities/event.entity";
import { HouseZone } from "src/house-zones/entities/house-zone.entity";
import { Notice } from "src/notices/entities/notice.entity";
import { OrganizationDetail } from "src/organization-details/entities/organization-detail.entity";
import { PartnerDetail } from "src/partner-details/entities/partner-detail.entity";
import { PaymentHistory } from "src/payment-history/entities/payment-history.entity";
import { StaffDetail } from "src/staff-details/entities/staff-detail.entity";
import { StudentAttendance } from "src/student-attendance/entities/student-attendance.entity";
import { Student } from "src/students/entities/student.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Setting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: SMType, default: SMType.SINGLE })
  type: SMType;

  @Column({ type: "text", nullable: true })
  csvFields: string;

  @Column({ type: "text", nullable: true })
  staffCsvFields: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Account, (account) => account.setting)
  account: Account[];

  @OneToMany(() => Subject, (subject) => subject.setting)
  subject: Subject[];

  @OneToMany(() => BookCategory, (bookCategory) => bookCategory.setting)
  bookCategory: BookCategory[];

  @OneToMany(() => Book, (book) => book.setting)
  book: Book[];

  @OneToMany(() => ClassDiv, (classDiv) => classDiv.setting)
  classDiv: ClassDiv[];

  @OneToMany(() => ClassList, (classList) => classList.setting)
  classList: ClassList[];

  @OneToMany(() => Designation, (designation) => designation.setting)
  designation: Designation[];

  @OneToMany(() => HouseZone, (houseZone) => houseZone.setting)
  houseZone: HouseZone[];

  @OneToMany(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.setting
  )
  organizationDetail: OrganizationDetail[];

  @OneToMany(() => Department, (department) => department.setting)
  department: Department[];

  @OneToMany(() => Student, (student) => student.setting)
  student: Student[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.setting
  )
  studentAttendance: StudentAttendance[];

  @OneToMany(() => Notice, (notice) => notice.setting)
  notice: Notice[];

  @OneToMany(() => PartnerDetail, (partnerDetail) => partnerDetail.setting)
  partnerDetail: PartnerDetail[];

  @OneToMany(() => Event, (event) => event.setting)
  event: Event[];

  @OneToMany(() => CardOrder, (cardOrder) => cardOrder.setting)
  cardOrder: CardOrder[];

  @OneToMany(() => StaffDetail, (staffDetail) => staffDetail.setting)
  staffDetail: StaffDetail[];

  @OneToMany(() => Cart, (cart) => cart.setting)
  cart: Cart[];

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.setting)
  paymentHistory: PaymentHistory[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.setting)
  cartProduct: CartProduct[];
}
