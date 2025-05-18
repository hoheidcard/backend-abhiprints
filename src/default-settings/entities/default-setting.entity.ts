import { DefaultSettingPermission } from '../../default-setting-permission/entities/default-setting-permission.entity';
import { DefaultSettingFor, DefaultSettingType } from '../../enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DefaultSetting {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({
    type: 'enum',
    enum: DefaultSettingType,
    default: DefaultSettingType.CLASS,
  })
  type: DefaultSettingType;

  @Column({
    type: 'enum',
    enum: DefaultSettingFor,
    default: DefaultSettingFor.SCHOOL,
  })
  for: DefaultSettingFor;

  @OneToMany(
    () => DefaultSettingPermission,
    (defaultSettingPermission) => defaultSettingPermission.defaultSetting,
  )
  defaultSettingPermission: DefaultSettingPermission[];
}
