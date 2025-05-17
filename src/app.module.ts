import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BullModule } from "@nestjs/bull";
import { AccountModule } from "./account/account.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { BankAccount } from "./bank-account/entities/bank-account.entity";
import { BannerModule } from "./banner/banner.module";
import { BlogsModule } from "./blogs/blogs.module";
import { BookCategoryModule } from "./book-category/book-category.module";
import { BooksModule } from "./books/books.module";
import { CardOrdersModule } from "./card-orders/card-orders.module";
import { CartProductModule } from "./cart-product/cart-product.module";
import { CartsModule } from "./carts/carts.module";
import { CategoryModule } from "./category/category.module";
import { ClassDivModule } from "./class-div/class-div.module";
import { ClassListModule } from "./class-list/class-list.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DefaultSettingPermissionModule } from "./default-setting-permission/default-setting-permission.module";
import { DefaultSettingsModule } from "./default-settings/default-settings.module";
import { DefaultModule } from "./default/default.module";
import { DeliveryPartnersModule } from "./delivery-partners/delivery-partners.module";
import { DepartmentsModule } from "./departments/departments.module";
import { DesignationPermissionModule } from "./designation-permission/designation-permission.module";
import { DesignationModule } from "./designation/designation.module";
import { EventOrganizationsModule } from "./event-organizations/event-organizations.module";
import { EventsModule } from "./events/events.module";
import { FaqsModule } from "./faqs/faqs.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { HouseZonesModule } from "./house-zones/house-zones.module";
import { IdCardsStockModule } from "./id-cards-stock/id-cards-stock.module";
import { LoginHistoryModule } from "./login-history/login-history.module";
import { MenusModule } from "./menus/menus.module";
import { NoticesModule } from "./notices/notices.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { NotifyModule } from "./notify/notify.module";
import { OrganizationDetailsModule } from "./organization-details/organization-details.module";
import { PagesModule } from "./pages/pages.module";
import { PartnerDetailsModule } from "./partner-details/partner-details.module";
import { PartnerDocumentsModule } from "./partner-documents/partner-documents.module";
import { PaymentHistoryModule } from "./payment-history/payment-history.module";
import { PermissionsModule } from "./permissions/permissions.module";
import { ProductImagesModule } from "./product-images/product-images.module";
import { ProductVariantsModule } from "./product-variants/product-variants.module";
import { SettingsModule } from "./settings/settings.module";
import { StaffDepartmentModule } from "./staff-department/staff-department.module";
import { StaffDetailsModule } from "./staff-details/staff-details.module";
import { StaffDocumentsModule } from "./staff-documents/staff-documents.module";
import { StaffSubjectModule } from "./staff-subject/staff-subject.module";
import { StudentAttendanceModule } from "./student-attendance/student-attendance.module";
import { StudentDocumentsModule } from "./student-documents/student-documents.module";
import { StudentsModule } from "./students/students.module";
import { SubPartnerDetailsModule } from "./sub-partner-details/sub-partner-details.module";
import { SubjectsModule } from "./subjects/subjects.module";
import { UserDetailsModule } from "./user-details/user-details.module";
import { UserPermissionsModule } from "./user-permissions/user-permissions.module";
import { UserAddressModule } from "./user-address/user-address.module";
import { ContactUsModule } from "./contact-us/contact-us.module";
import { NewsModule } from "./news/news.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'short',
    //     ttl: 1000,
    //     limit: 3,
    //   },
    //   {
    //     name: 'medium',
    //     ttl: 10000,
    //     limit: 20,
    //   },
    //   {
    //     name: 'long',
    //     ttl: 60000,
    //     limit: 100,
    //   },
    // ]),
    // aws db connection
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,  // default MySQL port
      username: 'axoncard_idmitra',
      password: 'Sain@123vikas!@#!@#',
      database: 'axoncard_idmitra',
      autoLoadEntities: true,
      synchronize: true,
    }),


    CacheModule.register({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    AccountModule,
    AuthModule,
    MenusModule,
    PermissionsModule,
    UserPermissionsModule,
    PagesModule,
    SettingsModule,
    NotificationsModule,
    NotifyModule,
    DashboardModule,
    DefaultModule,
    LoginHistoryModule,
    DesignationModule,
    StaffDetailsModule,
    BankAccount,
    PartnerDetailsModule,
    SubPartnerDetailsModule,
    OrganizationDetailsModule,
    FeedbackModule,
    FaqsModule,
    DepartmentsModule,
    HouseZonesModule,
    NoticesModule,
    BooksModule,
    BookCategoryModule,
    ClassListModule,
    ClassDivModule,
    StaffDocumentsModule,
    StaffSubjectModule,
    SubjectsModule,
    StaffDepartmentModule,
    StudentsModule,
    StudentAttendanceModule,
    StudentDocumentsModule,
    PartnerDocumentsModule,
    IdCardsStockModule,
    DefaultSettingsModule,
    DesignationPermissionModule,
    DefaultSettingPermissionModule,
    EventsModule,
    EventOrganizationsModule,
    CardOrdersModule,
    DeliveryPartnersModule,
    CategoryModule,
    BlogsModule,
    BannerModule,
    UserDetailsModule,
    CartsModule,
    CartProductModule,
    ProductVariantsModule,
    ProductImagesModule,
    PaymentHistoryModule,
    UserAddressModule,
    ContactUsModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
