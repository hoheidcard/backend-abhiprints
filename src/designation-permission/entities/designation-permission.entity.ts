import { Designation } from "../../designation/entities/designation.entity";
import { Menu } from "../../menus/entities/menu.entity";
import { Permission } from "../../permissions/entities/permission.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DesignationPermission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', nullable: true })
  menuId: number;

  @Column({ type: 'int', nullable: true })
  permissionId: number;

  @Column({ type: 'uuid', nullable: true })
  designationId: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Menu, (menu) => menu.designationPermission, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  menu: Menu[];

  @ManyToOne(
    () => Designation,
    (designation) => designation.designationPermission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  designation: Designation[];

  @ManyToOne(
    () => Permission,
    (permission) => permission.designationPermission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  permission: Permission[];
}
