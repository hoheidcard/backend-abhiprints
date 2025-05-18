import { Account } from '../../account/entities/account.entity';
import { ClassList } from '../../class-list/entities/class-list.entity';
import { DefaultStatus, UserRole } from '../../enum';
import { OrganizationDetail } from '../../organization-details/entities/organization-detail.entity';
import { Setting } from '../../settings/entities/setting.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  desc: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  type: UserRole;

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
  organizationDetailId: string;

  @ManyToOne(() => Setting, (setting) => setting.notice, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.notice, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(
    () => OrganizationDetail,
    (organizationDetail) => organizationDetail.notice,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  organizationDetail: OrganizationDetail[];
}
