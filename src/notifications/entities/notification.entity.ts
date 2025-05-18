import { Account } from "../../account/entities/account.entity";
import { NotificationType } from "../../enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  desc: string;

  @Column({ type: "enum", enum: NotificationType, nullable: true })
  type: NotificationType;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.notification, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  account: Account[];
}
