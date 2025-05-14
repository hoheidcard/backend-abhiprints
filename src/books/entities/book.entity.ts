import { Account } from 'src/account/entities/account.entity';
import { BookCategory } from 'src/book-category/entities/book-category.entity';
import { ClassList } from 'src/class-list/entities/class-list.entity';
import { DefaultStatus } from 'src/enum';
import { OrganizationDetail } from 'src/organization-details/entities/organization-detail.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  shortDesc: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  imageName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  code: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
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
  bookCategoryId: string;

  @Column({ type: 'uuid', nullable: true })
  classListId: string;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @Column({ type: 'uuid', nullable: true })
  organizationDetailId: string;

  @ManyToOne(() => Setting, (setting) => setting.book, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.book, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => BookCategory, (bookCategory) => bookCategory.book, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bookCategory: BookCategory[];

  @ManyToOne(() => ClassList, (classList) => classList.book, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  classList: ClassList[];

  @ManyToOne(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.book,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  organizationDetail: OrganizationDetail[];
}
