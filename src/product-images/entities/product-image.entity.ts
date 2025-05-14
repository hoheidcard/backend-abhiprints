import { ProductFileType } from 'src/enum';
import { IdCardsStock } from 'src/id-cards-stock/entities/id-cards-stock.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  file: string;

  @Column({ type: 'text', nullable: true })
  fileName: string;

  @Column({
    type: 'enum',
    enum: ProductFileType,
    default: ProductFileType.IMAGE,
  })
  type: ProductFileType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  idCardsStockId: string;

  @ManyToOne(() => IdCardsStock, (idCardsStock) => idCardsStock.productImage, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  idCardsStock: IdCardsStock[];
}
