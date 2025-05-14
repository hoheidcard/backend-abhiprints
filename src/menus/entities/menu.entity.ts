import { DefaultSettingPermissionModule } from 'src/default-setting-permission/default-setting-permission.module';
import { DefaultSettingPermission } from 'src/default-setting-permission/entities/default-setting-permission.entity';
import { DesignationPermission } from 'src/designation-permission/entities/designation-permission.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  title: string;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.menu)
  userPermission: UserPermission[];

  @OneToMany(
    () => DesignationPermission,
    (designationPermission) => designationPermission.menu,
  )
  designationPermission: DesignationPermission[];

  @OneToMany(
    () => DefaultSettingPermission,
    (defaultSettingPermission) => defaultSettingPermission.menu,
  )
  defaultSettingPermission: DefaultSettingPermission[];
}
