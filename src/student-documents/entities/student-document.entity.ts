import { Account } from '../../account/entities/account.entity';
import { DocumentStatus, DocumentType } from '../../enum';
import { Student } from '../../students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StudentDocument {
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
  studentId: string;

  @ManyToOne(() => Account, (account) => account.studentDocument, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Student, (student) => student.studentDocument, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  student: Student[];
}
