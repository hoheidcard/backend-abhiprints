import { BannerType, DefaultStatus } from "src/enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Banner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 100,  nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @Column({ type: 'text', nullable: true })
  link: string;

  @Column({ type: "text", nullable: true })
  image: string;

  @Column({ type: "text", nullable: true })
  imageName: string;

  @Column({ type: "date", nullable: true })
  endDate: Date;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: "enum", enum: BannerType, default: BannerType.TOP })
  type: BannerType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
