import { DefaultSetting } from '../../default-settings/entities/default-setting.entity';
import { Menu } from '../../menus/entities/menu.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DefaultSettingPermission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', nullable: true })
  menuId: number;

  @Column({ type: 'int', nullable: true })
  permissionId: number;

  @Column({ type: 'uuid', nullable: true })
  defaultSettingId: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Menu, (menu) => menu.defaultSettingPermission, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  menu: Menu[];

  @ManyToOne(
    () => DefaultSetting,
    (defaultSetting) => defaultSetting.defaultSettingPermission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  defaultSetting: DefaultSetting[];

  @ManyToOne(
    () => Permission,
    (permission) => permission.defaultSettingPermission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  permission: Permission[];
}
