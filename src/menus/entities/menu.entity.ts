import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DefaultSettingPermission } from '../../default-setting-permission/entities/default-setting-permission.entity';
import { DesignationPermission } from '../../designation-permission/entities/designation-permission.entity';
import { UserPermission } from '../../user-permissions/entities/user-permission.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(
    () => UserPermission,
    (userPermission: UserPermission) => userPermission.menu,
  )
  userPermission: UserPermission[];

  @OneToMany(
    () => DesignationPermission,
    (designationPermission: DesignationPermission) => designationPermission.menu,
  )
  designationPermission: DesignationPermission[];

  @OneToMany(
    () => DefaultSettingPermission,
    (defaultSettingPermission: DefaultSettingPermission) => defaultSettingPermission.menu,
  )
  defaultSettingPermission: DefaultSettingPermission[];
}
