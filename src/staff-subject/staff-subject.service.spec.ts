import { Test, TestingModule } from '@nestjs/testing';
import { StaffSubjectService } from './staff-subject.service';

describe('StaffSubjectService', () => {
  let service: StaffSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffSubjectService],
    }).compile();

    service = module.get<StaffSubjectService>(StaffSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
