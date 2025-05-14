import { Account } from 'src/account/entities/account.entity';
import { DefaultStatus, SMType } from 'src/enum';
import { EventOrganization } from 'src/event-organizations/entities/event-organization.entity';
import { PartnerDocument } from 'src/partner-documents/entities/partner-document.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PartnerDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firmName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firmEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerEmail: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ownerMobile: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ownerWhatsApp: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  natureOfBusiness: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  gstDetail: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  logoName: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  firmShort: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  firmAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pincode: string;

  @Column({ type: 'enum', enum: SMType, default: SMType.SINGLE })
  singleMultiType: SMType;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid' })
  updatedId: string;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.partnerDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Account, (updated) => updated.partnerDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  updated: Account[];

  @ManyToOne(() => Setting, (setting) => setting.partnerDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @OneToMany(
    () => PartnerDocument,
    (partnerDocument) => partnerDocument.partnerDetail,
  )
  partnerDocument: PartnerDocument[];

  @OneToMany(() => StaffDetail, (staffDetail) => staffDetail.partnerDetail)
  staffDetail: StaffDetail[];

  @OneToMany(
    () => EventOrganization,
    (eventOrganization) => eventOrganization.partnerDetail,
  )
  eventOrganization: EventOrganization[];
}
