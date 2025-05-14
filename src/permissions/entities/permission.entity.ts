import { DefaultSettingPermission } from 'src/default-setting-permission/entities/default-setting-permission.entity';
import { DesignationPermission } from 'src/designation-permission/entities/designation-permission.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission,
  )
  userPermission: UserPermission[];

  @OneToMany(
    () => DesignationPermission,
    (designationPermission) => designationPermission.permission,
  )
  designationPermission: DesignationPermission[];

  @OneToMany(
    () => DefaultSettingPermission,
    (defaultSettingPermission) => defaultSettingPermission.permission,
  )
  defaultSettingPermission: DefaultSettingPermission[];
}
