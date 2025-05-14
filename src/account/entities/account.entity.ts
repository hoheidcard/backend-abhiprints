import { BankAccount } from "src/bank-account/entities/bank-account.entity";
import { Blog } from "src/blogs/entities/blog.entity";
import { BookCategory } from "src/book-category/entities/book-category.entity";
import { Book } from "src/books/entities/book.entity";
import { CardOrder } from "src/card-orders/entities/card-order.entity";
import { CartProduct } from "src/cart-product/entities/cart-product.entity";
import { Cart } from "src/carts/entities/cart.entity";
import { ClassDiv } from "src/class-div/entities/class-div.entity";
import { ClassList } from "src/class-list/entities/class-list.entity";
import { Department } from "src/departments/entities/department.entity";
import { AIType, DefaultStatus, UserRole } from "src/enum";
import { Event } from "src/events/entities/event.entity";
import { Faq } from "src/faqs/entities/faq.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { HouseZone } from "src/house-zones/entities/house-zone.entity";
import { LoginHistory } from "src/login-history/entities/login-history.entity";
import { Notice } from "src/notices/entities/notice.entity";
import { Notification } from "src/notifications/entities/notification.entity";
import { OrganizationDetail } from "src/organization-details/entities/organization-detail.entity";
import { PartnerDetail } from "src/partner-details/entities/partner-detail.entity";
import { PartnerDocument } from "src/partner-documents/entities/partner-document.entity";
import { PaymentHistory } from "src/payment-history/entities/payment-history.entity";
import { Setting } from "src/settings/entities/setting.entity";
import { StaffDepartment } from "src/staff-department/entities/staff-department.entity";
import { StaffDetail } from "src/staff-details/entities/staff-detail.entity";
import { StaffDocument } from "src/staff-documents/entities/staff-document.entity";
import { StaffSubject } from "src/staff-subject/entities/staff-subject.entity";
import { StudentAttendance } from "src/student-attendance/entities/student-attendance.entity";
import { StudentDocument } from "src/student-documents/entities/student-document.entity";
import { Student } from "src/students/entities/student.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { UserAddress } from "src/user-address/entities/user-address.entity";
import { UserDetail } from "src/user-details/entities/user-detail.entity";
import { UserPermission } from "src/user-permissions/entities/user-permission.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  deviceId: string;

  @Column({ type: "text", nullable: true })
  fcm: string;

  @Column({ type: "text", nullable: true })
  sessionId: string;

  @Column({ type: "int", default: 0 })
  priority: number;

  @Column({ type: "datetime", nullable: true })
  activeAt: Date;

  @Column({ type: "enum", enum: AIType, default: AIType.INACTIVE })
  lastStatus: AIType;

  @Column({ type: "uuid", nullable: true })
  createdBy: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.STUDENT })
  roles: UserRole;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  settingId: string;

  @ManyToOne(() => Setting, (setting) => setting.account, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  setting: Setting[];

  @OneToOne(() => StaffDetail, (staffDetail) => staffDetail.account)
  staffDetail: StaffDetail[];

  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.account)
  loginHistory: LoginHistory[];

  @OneToMany(() => Feedback, (feedback) => feedback.account)
  feedback: Feedback[];

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.account)
  bankAccount: BankAccount[];

  @OneToMany(() => Faq, (faq) => faq.account)
  faq: Faq[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.account)
  userPermission: UserPermission[];

  @OneToMany(() => StaffDocument, (staffDocument) => staffDocument.account)
  staffDocument: StaffDocument[];

  @OneToMany(() => ClassList, (classList) => classList.account)
  classList: ClassList[];

  @OneToMany(() => ClassDiv, (classDiv) => classDiv.account)
  classDiv: ClassDiv[];

  @OneToMany(() => BookCategory, (bookCategory) => bookCategory.account)
  bookCategory: BookCategory[];

  @OneToMany(() => Book, (book) => book.account)
  book: Book[];

  @OneToMany(() => Subject, (subject) => subject.account)
  subject: Subject[];

  @OneToMany(() => StaffSubject, (staffSubject) => staffSubject.account)
  staffSubject: StaffSubject[];

  @OneToMany(() => HouseZone, (houseZone) => houseZone.account)
  houseZone: HouseZone[];

  @OneToMany(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.account
  )
  organizationDetail: OrganizationDetail[];

  @OneToMany(() => Department, (department) => department.account)
  department: Department[];

  @OneToMany(
    () => StaffDepartment,
    (staffDepartment) => staffDepartment.account
  )
  staffDepartment: StaffDepartment[];

  @OneToMany(() => Student, (student) => student.account)
  student: Student[];

  @OneToMany(
    () => StudentAttendance,
    (studentAttendance) => studentAttendance.account
  )
  studentAttendance: StudentAttendance[];

  @OneToMany(
    () => StudentDocument,
    (studentDocument) => studentDocument.account
  )
  studentDocument: StudentDocument[];

  @OneToMany(() => PartnerDetail, (partnerDetail) => partnerDetail.account)
  partnerDetail: PartnerDetail[];

  @OneToMany(
    () => PartnerDocument,
    (partnerDocument) => partnerDocument.account
  )
  partnerDocument: PartnerDocument[];

  @OneToMany(() => Notice, (notice) => notice.account)
  notice: Notice[];

  @OneToMany(() => Event, (event) => event.account)
  event: Event[];

  @OneToMany(() => CardOrder, (cardOrder) => cardOrder.account)
  cardOrder: CardOrder[];

  @OneToMany(() => Blog, (blog) => blog.account)
  blog: Blog[];

  @OneToMany(() => Cart, (cart) => cart.account)
  cart: Cart[];

  @OneToMany(() => PaymentHistory, (paymentHistory) => paymentHistory.account)
  paymentHistory: PaymentHistory[];

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.account)
  cartProduct: CartProduct[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.account)
  userAddress: UserAddress[];

  @OneToMany(() => Notification, (notification) => notification.account)
  notification: Notification[];

  @OneToMany(() => UserDetail, (userDetail) => userDetail.account)
  userDetail: UserDetail[];
}
