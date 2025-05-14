import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  mobile: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  state: string;

  @Column({ type: 'text', nullable: true })
  enquiryFor: string;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
