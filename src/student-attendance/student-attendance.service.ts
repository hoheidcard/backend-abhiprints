import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceStatus } from "src/enum";
import { Repository } from "typeorm";
import { StudentAttendanceDto } from "./dto/student-attendance.dto";
import { StudentAttendance } from "./entities/student-attendance.entity";
import { DatePaginationDto } from "src/common/dto/pagination-with-date.dto";

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectRepository(StudentAttendance)
    private readonly repo: Repository<StudentAttendance>
  ) {}

  async create(dto: StudentAttendanceDto[]) {
    dto.forEach(async (element) => {
      const result = await this.repo.findOne({ where: element });
      if (!result) {
        const obj = Object.create(element);
        this.repo.save(obj);
      }
    });
  }

  async findAll(studentId: string, dto: DatePaginationDto) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);
    const [result, total] = await this.repo
      .createQueryBuilder("studentAttendance")
      .leftJoinAndSelect("studentAttendance.student", "student")
      .select([
        "studentAttendance.id",
        "studentAttendance.date",
        "studentAttendance.status",
        "student.id",
        "student.rollNo",
        "student.name",
      ])
      .where(
        "studentAttendance.studentId = :studentId AND studentAttendance.date >= :fromDate AND studentAttendance.date <= :toDate",
        {
          studentId,
          fromDate,
          toDate,
        }
      )
      .orderBy({ "studentAttendance.date": "DESC" })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException("Attendance not found!");
    }
    const obj = Object.assign(result, { status: AttendanceStatus.ABSENT });
    return this.repo.save(obj);
  }
}
