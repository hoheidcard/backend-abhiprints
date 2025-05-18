import { PageType } from '../../enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Page {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: PageType })
  title: PageType;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @Column({ type: 'uuid' })
  updatedId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
