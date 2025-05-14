import { Account } from 'src/account/entities/account.entity';
import { DocumentStatus, DocumentType } from 'src/enum';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StaffDocument {
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
  staffDetailId: string;

  @ManyToOne(() => Account, (account) => account.staffDocument, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => StaffDetail, (staffDetail) => staffDetail.staffDocument, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  staffDetail: StaffDetail[];
}
