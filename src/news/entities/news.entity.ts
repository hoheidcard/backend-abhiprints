import { DefaultStatus } from "../enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 200, nullable: true})
    title: string;

    @Column({type: 'text', nullable: true})
    desc: string;
    
    @Column({type: 'text', nullable: true})
    image: string;
    
    @Column({type: 'text', nullable: true})
    imagePath: string;

    @Column({type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING})
    status: DefaultStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
