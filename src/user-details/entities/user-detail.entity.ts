import { Account } from "../../account/entities/account.entity";
import { Gender } from "../../enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class UserDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  lastName: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  email: string;

  @Column({ type: "date", nullable: true })
  dob: Date;

  @Column({ type: "enum", enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ type: "text", nullable: true })
  profile: string;

  @Column({ type: "text", nullable: true })
  profileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "uuid", nullable: true })
  accountId: string;

  @OneToOne(() => Account, (account) => account.userDetail, {
    cascade: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn()
  account: Account[];
}
