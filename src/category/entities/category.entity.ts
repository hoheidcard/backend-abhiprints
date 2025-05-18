import { DefaultStatus } from "../../enum";
import { IdCardsStock } from "../../id-cards-stock/entities/id-cards-stock.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  desc: string;

  @Column({ type: "text", nullable: true })
  image: string;

  @Column({ type: "text", nullable: true })
  imageName: string;

  @Column({ type: "enum", enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => IdCardsStock,
    (idCardsStock) => idCardsStock.category,
  )
  idCardsStock: IdCardsStock[];

  // @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  // subCategory: SubCategory[];
}
