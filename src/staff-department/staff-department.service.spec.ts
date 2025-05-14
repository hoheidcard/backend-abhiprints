import { Test, TestingModule } from '@nestjs/testing';
import { StaffDepartmentService } from './staff-department.service';

describe('StaffDepartmentService', () => {
  let service: StaffDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffDepartmentService],
    }).compile();

    service = module.get<StaffDepartmentService>(StaffDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
