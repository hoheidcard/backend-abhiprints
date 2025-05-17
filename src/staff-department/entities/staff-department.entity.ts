import { Account } from '../../account/entities/account.entity';
import { Department } from '../../departments/entities/department.entity';
import { StaffDetail } from '../../staff-details/entities/staff-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StaffDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  staffDetailId: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  updatedId: string;

  @Column({ type: 'uuid', nullable: true })
  departmentId: string;

  @ManyToOne(() => Account, (account) => account.staffDepartment, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Department, (department) => department.staffDepartment, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  department: Department[];

  @ManyToOne(() => StaffDetail, (staffDetail) => staffDetail.staffDepartment, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  staffDetail: StaffDetail[];
}
