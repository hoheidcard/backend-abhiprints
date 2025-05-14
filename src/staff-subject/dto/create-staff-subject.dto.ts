import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateStaffSubjectDto {
    @IsOptional()
    subjectId: string;

    @IsOptional()
    accountId: string;

    @IsOptional()
    staffDetailId: string
}
