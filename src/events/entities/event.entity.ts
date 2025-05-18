import { Account } from '../../account/entities/account.entity';
import { DefaultStatus, EventFor, EventLowerFor } from '../../enum';
import { EventOrganization } from '../../event-organizations/entities/event-organization.entity';
import { Setting } from '../../settings/entities/setting.entity';
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
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @Column({ type: 'date', nullable: true })
  eventDate: Date;

  @Column({ type: 'time', nullable: true })
  fromTime: Date;

  @Column({ type: 'time', nullable: true })
  toTime: Date;

  @Column({ type: 'boolean', default: false })
  all: boolean;

  @Column({ type: 'enum', enum: EventFor, default: EventFor.SCHOOL })
  eventFor: EventFor;

  @Column({ type: 'enum', enum: EventLowerFor, default: EventLowerFor.UPPER })
  type: EventLowerFor;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  updatedId: string;

  @Column({ type: 'uuid', nullable: true })
  settingId: string;

  @ManyToOne(() => Account, (account) => account.event, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Setting, (setting) => setting.event, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  setting: Setting[];

  @OneToMany(
    () => EventOrganization,
    (eventOrganization) => eventOrganization.event,
  )
  eventOrganization: EventOrganization[];
}
