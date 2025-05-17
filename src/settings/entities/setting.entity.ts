import { Account } from "../../account/entities/account.entity";
import { BookCategory } from "../../book-category/entities/book-category.entity";
import { Book } from "../../books/entities/book.entity";
import { CardOrder } from "../../card-orders/entities/card-order.entity";
import { CartProduct } from "../../cart-product/entities/cart-product.entity";
import { Cart } from "../../carts/entities/cart.entity";
import { ClassDiv } from "../../class-div/entities/class-div.entity";
import { ClassList } from "../../class-list/entities/class-list.entity";
import { Department } from "../../departments/entities/department.entity";
import { Designation } from "../../designation/entities/designation.entity";
import { SMType } from "../../enum";
import { Event } from "../../events/entities/event.entity";
import { HouseZone } from "../../house-zones/entities/house-zone.entity";
import { Notice } from "../../notices/entities/notice.entity";
import { OrganizationDetail } from "../../organization-details/entities/organization-detail.entity";
import { PartnerDetail } from "../../partner-details/entities/partner-detail.entity";
import { PaymentHistory } from "../../payment-history/entities/payment-history.entity";
import { StaffDetail } from "../../staff-details/entities/staff-detail.entity";
import { StudentAttendance } from "../../student-attendance/entities/student-attendance.entity";
import { Student } from "../../students/entities/student.entity";
import { Subject } from "../../subjects/entities/subject.entity";
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
