export enum UserRole {
  ROOT = "ROOT", //1

  ADMIN = "ADMIN", //2
  STAFF = "STAFF", //less than upper

  PARTNER = "PARTNER", //3

  SUB_PARTNER = "SUB PARTNER", //3

  SCHOOL = "SCHOOL", //4
  COLLEGE = "COLLEGE", //4
  ORGANIZATION = "ORGANIZATION", //4

  PARENT = "PARENT", //20
  STUDENT = "STUDENT", //20

  USER = "USER", //20
}

export enum CartStatus {
  DELETED = "DELETED",
  CART = "CART",
  CANCELLED = "CANCELLED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  DISPATCH = "DISPATCH",
  RETURN = "RETURN",
  REPLACE = "REPLACE",
}

export enum OrderType {
  STAFF = "STAFF", //less than upper
  STUDENT = "STUDENT", //20
}

export enum EventLowerFor {
  UPPER = "UPPER",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
}

export enum EventFor {
  PARTNER = "PARTNER",
  SUB_PARTNER = "SUB PARTNER",
  SCHOOL = "SCHOOL",
  COLLEGE = "COLLEGE",
  ORGANIZATION = "ORGANIZATION",
}

export enum VariantType {
  SIZE = "SIZE",
  PRODUCT_COLOR = "PRODUCT COLOR",
  MATERIAL = "MATERIAL",
  STYLE = "STYLE",
  WEIGHT = "WEIGHT",
  LENGTH = "LENGTH",
  WIDTH = "WIDTH",
  HEIGHT = "HEIGHT",
  TYPE = "TYPE",
  DIRECTION = "DIRECTION",
  PRINTING = "PRINTING",
  PRINTING_COLOR = "PRINTING COLOR",
  PRINTABLE = "PRINTABLE",
  LAMINATION = "LAMINATION",
}

export enum ReferredVia {
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  WHATS_APP = "WHATS APP",
  LINKED_IN = "LINKED IN",
  TWITTER = "TWITTER",
  INSTAGRAM = "INSTAGRAM",
  TELEGRAM = "TELEGRAM",
  OTHER = "OTHER",
}

export enum DocumentStatus {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
  PENDING = "PENDING",
}

export enum OrderStatus {
  COMPLETED = "COMPLETED",
  IN_PROCESS = "IN_PROCESS",
  CANCELLED = "CANCELLED",
  DELETED = "DELETED",
  PENDING = "PENDING",
}

export enum OrderFilterType {
  ORDER_DATE = "ORDER DATE",
  DELIVERY_DATE = "DELIVERY DATE",
}

export enum DocumentType {
  PAN_CARD = "PAN CARD",
  AADHAR_CARD = "AADHAR CARD",
  OTHER = "OTHER",
}

export enum PartnerType {
  PARTNER = "PARTNER",
  SUB_PARTNER = "SUB PARTNER",
}

export enum ProductFileType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export enum Stream {
  SCIENCE = "SCIENCE",
  COMMERCE = "COMMERCE",
  ARTS = "ARTS",
}

export enum DefaultStatus {
  ACTIVE = "ACTIVE",
  DEACTIVE = "DEACTIVE",
  DELETED = "DELETED",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

export enum BannerType {
  TOP = "TOP",
  DEAL = "DEAL",
}

export enum SideType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
}

export enum BankStatus {
  VERIFIED = "VERIFIED",
  DEACTIVE = "DEACTIVE",
  DELETED = "DELETED",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export enum SMType {
  SINGLE = "SINGLE",
  MULTI = "MULTI",
}

export enum BranchType {
  MAIN = "MAIN",
  BRANCH = "BRANCH",
}

export enum ProductStatus {
  PENDING = "PENDING",
  DEACTIVE = "DEACTIVE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
  SUSPENDED = "SUSPENDED",
}

export enum ReviewStatus {
  ACTIVE = "ACTIVE",
  DELETED = "DELETED",
}

export enum AIType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ADType {
  ASC = "ASC",
  DESC = "DESC",
  NONE = "",
}

export enum FeedbackStatus {
  YES = "YES",
  NO = "NO",
  DELETED = "DELETED",
}

export enum QnAStatus {
  YES = "YES",
  NO = "NO",
  DELETED = "DELETED",
}

export enum ContactUsStatus {
  PENDING = "PENDING",
  REPLIED = "REPLIED",
}

export enum TicketStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  NOT_RESOLVED = "NOT RESOLVED",
  IN_PROCESS = "IN PROCESS",
}

export enum PermissionAction {
  CREATE = "Create",
  READ = "Read",
  UPDATE = "Update",
  DELETE = "Delete",
}

export enum LogType {
  LOGIN = "IN",
  LOGOUT = "OUT",
}

export enum RedirectType {
  PRODUCT = "PRODUCT",
  VENDOR = "VENDOR",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum PageType {
  TNC = "Terms & Conditions",
  PRIVACY_POLICY = "Privacy Policy",
  REFUND_POLICY = "Refund Policy",
  ABOUT_US = "About Us",
  IP_INFINGERPRINT = "Ip Infingerprint",
  PRODUCT_POLICY = "Product Policy",
  SELLER_AND_BUYER_POLICY = "Seller And Buyer Policy",
  HOW_TO_REGISTER = "How To Register",
  WHY_ME_REGISTER = "Why Me Register",
  HOW_THIS_WORKS = "How This Works",
}

export enum NotificationType {
  // ALL FOR ADMIN AND STAFF
  NEW_PRODUCT = "NEW PRODUCT",
  NEW_ACCOUNT = "NEW ACCOUNT",
  CONTACT_US = "CONTACT US",
  QNA = "QNA",
  FEEDBACK = "FEEDBACK",
  INVOICE = "INVOICE",
  STAFF = "STAFF",
  TICKET = "TICKET",

  // ALL FOR VENDOR
  PRODUCT = "PRODUCT",
  PRODUCT_VIEW = "PRODUCT VIEW",
  VENDOR_RATING = "VENDOR RATING",
  VENDOR_ACCOUNT = "VENDOR ACCOUNT",
  VENDOR_INVOICE = "VENDOR INVOICE",
  VENDOR_PAYMENT = "VENDOR PAYMENT",
  VENDOR_TICKET = "VENDOR TICKET",

  // ALL FOR USER
  USER_PRODUCT = "USER PRODUCT",
  USER_ACCOUNT = "USER ACCOUNT",
  USER_INVOICE = "USER INVOICE",
  USER_PAYMENT = "USER PAYMENT",
  USER_TICKET = "USER TICKET",
  OFFER = "OFFER",

  // FOR ALL
  LOGIN = "LOGIN",
}

export enum YNStatus {
  YES = "Yes",
  NO = "No",
  ALL = "All",
}

export enum WarrantyPeriod {
  DAY = "Day",
  MONTH = "Month",
  YEAR = "Year",
}

export enum DayList {
  SUNDAY = "Sunday",
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
}

export enum Feature {
  TRUE = "TRUE",
  FALSE = "FALSE",
}

export enum RatingShortStatus {
  ASC = "ASC",
  DESC = "DESC",
  ALL = "ALL",
}

export enum TeacherType {
  CLASS_TEACHER = "CLASS_TEACHER",
  TEACHER = "TEACHER",
}

export enum PaymentType {
  COD = "COD",
  RAZOR_PAY = "Razor Pay",
  PHONE_PE = "Phone Pe",
  ALL = "All",
}

export enum PaymentStatus {
  FAILED = "FAILED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  COMPLETED = "COMPLETED",
  ALL = "ALL",
}

export enum DefaultSettingType {
  CLASS = "CLASS",
  DIVISION = "DIVISION",
  DESIGNATION = "DESIGNATION",
  BOOK_CATEGORY = "BOOK CATEGORY",
  DEPARTMENT = "DEPARTMENT",
  HOUSE_ZONE = "HOUSE ZONE",
  SUBJECT = "SUBJECT",
}

export enum DefaultSettingFor {
  SCHOOL = "SCHOOL",
  COLLEGE = "COLLEGE",
  ORGANIZATION = "ORGANIZATION",
}

export enum StudentOrderCardType {
  REMAINING = "REMAINING",
  CARD = "CARD",
  IN_PROCESS = "IN_PROCESS",
  PRINTED = "PRINTED",
  REPRINTED = "REPRINTED",
}
