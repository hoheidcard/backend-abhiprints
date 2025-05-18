import { Exclude } from 'class-transformer';
import { Account } from '../../account/entities/account.entity';
import { Setting } from '../../settings/entities/setting.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  desc: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @Column({ type: 'uuid',nullable: true })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.feedback, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];
}
