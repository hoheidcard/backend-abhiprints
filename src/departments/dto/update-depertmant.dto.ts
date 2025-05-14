import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdateDepartmentDto{
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    name: string;
}