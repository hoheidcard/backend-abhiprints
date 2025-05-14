import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateDesignationPermissionDto {
  @IsNotEmpty()
  @IsUUID()
  designationId: string;

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

export class DesignationPermissionDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  designationId: string;

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
  userPermission: DesignationPermissionDto[];
}

export class UpdatePermissionDto {
  @IsNotEmpty()
  menu: MenuDto[];
}

export class UpdateDesignationPermissionDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsUUID()
  designationId: string;

  @IsNotEmpty()
  menuId: number;

  @IsNotEmpty()
  permissionId: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
