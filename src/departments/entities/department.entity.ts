import { Account } from 'src/account/entities/account.entity';
import { DefaultStatus } from 'src/enum';
import { Setting } from 'src/settings/entities/setting.entity';
import { StaffDepartment } from 'src/staff-department/entities/staff-department.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

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
  settingId: string;

  @ManyToOne(() => Setting, (setting) => setting.department, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @ManyToOne(() => Account, (account) => account.department, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @OneToMany(
    () => StaffDepartment,
    (staffDepartment) => staffDepartment.department,
  )
  staffDepartment: StaffDepartment[];
}
