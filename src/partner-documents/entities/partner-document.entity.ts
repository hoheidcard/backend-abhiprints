import { Account } from '../../account/entities/account.entity';
import { DocumentStatus, DocumentType } from '../../enum';
import { PartnerDetail } from '../../partner-details/entities/partner-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PartnerDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: DocumentType, default: DocumentType.OTHER })
  type: DocumentType;

  @Column({ type: 'varchar', length: 50, nullable: true })
  documentId: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  updatedId: string;

  @Column({ type: 'uuid', nullable: true })
  partnerDetailId: string;

  @ManyToOne(() => Account, (account) => account.partnerDocument, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(
    () => PartnerDetail,
    (partnerDetail) => partnerDetail.partnerDocument,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  partnerDetail: PartnerDetail[];
}
