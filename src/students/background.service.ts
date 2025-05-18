import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { uploadFileHandler } from '../utils/fileUpload.utils';
import { StudentsService } from './students.service';

@Processor('create-student-queue')
export class BackgroundProcessorService {
  constructor(private readonly studentService: StudentsService) {}

  @Process('processCreateStudent')
  async processCreateStudent(
    job: Job<{
      files: Array<Express.Multer.File>;
      updatedId: string;
      organizationDetailId: string;
      settingId: string;
    }>,
  ): Promise<void> {
    // console.log(job.data);
  }
}

// if (line && line.length > 0) {
//   const columns = line.split(',');
//   const rowData = {
//     regNo: columns[0] === '' ? null : columns[0],
//     studentNo: columns[1] === '' ? null : columns[1],
//     admissionNo: columns[2] === '' ? null : columns[2],
//     rollNo: columns[3] === '' ? null : columns[3],
//     rfidNo: columns[4] === '' ? null : columns[4],
//     name: columns[5] === '' ? null : columns[5],
//     emailId: columns[6] === '' ? null : columns[6],
//     cast: columns[7] === '' ? null : columns[7],
//     religion: columns[8] === '' ? null : columns[8],
//     nationality: columns[9] === '' ? null : columns[9],
//     contactNo: columns[10] === '' ? null : columns[10],
//     address: columns[11] === '' ? null : columns[11],
//     city: columns[12] === '' ? null : columns[12],
//     state: columns[13] === '' ? null : columns[13],
//     pincode: columns[14] === '' ? null : columns[14],
//     imageNumber: columns[15] === '' ? null : columns[15],
//     gender: columns[16] === '' ? null : columns[16],
//     dob: columns[17] === '' ? null : columns[17],
//     fatherName: columns[18] === '' ? null : columns[18],
//     fatherContactNo: columns[19] === '' ? null : columns[19],
//     fatherOccupation: columns[20] === '' ? null : columns[20],
//     fatherIncome: columns[21] === '' ? null : columns[21],
//     motherName: columns[22] === '' ? null : columns[22],
//     motherContactNo: columns[23] === '' ? null : columns[23],
//     motherOccupation: columns[24] === '' ? null : columns[24],
//     motherIncome: columns[25] === '' ? null : columns[25],
//     classListId: columns[26] === '' ? null : columns[26],
//     classDivId: columns[27] === '' ? null : columns[27],
//     houseZoneId: columns[28] === '' ? null : columns[28],
//   };
//   data.push(rowData);
// }
