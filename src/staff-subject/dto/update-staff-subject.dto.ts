import { PartialType } from '@nestjs/swagger';
import { CreateStaffSubjectDto } from './create-staff-subject.dto';

export class UpdateStaffSubjectDto extends PartialType(CreateStaffSubjectDto) {}
