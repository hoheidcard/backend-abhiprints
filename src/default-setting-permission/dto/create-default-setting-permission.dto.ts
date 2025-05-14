import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateSettingPermissionDto {
  @IsNotEmpty()
  @IsUUID()
  defaultSettingId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  menuId: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  permissionId: number;
}

export class PermissionDto {
  @IsNotEmpty()
  id: number;
}

export class SettingPermissionDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  defaultSettingId: string;

  @IsNotEmpty()
  menuId: number;

  @IsNotEmpty()
  permissionId: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  permission: PermissionDto;
}

export class MenuDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  userPermission: SettingPermissionDto[];
}

export class UpdatePermissionDto {
  @IsNotEmpty()
  menu: MenuDto[];
}

export class UpdateSettingPermissionDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  defaultSettingId: string;

  @IsNotEmpty()
  menuId: number;

  @IsNotEmpty()
  permissionId: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
