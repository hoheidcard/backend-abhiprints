import { Test, TestingModule } from '@nestjs/testing';
import { StaffDocumentsService } from './staff-documents.service';

describe('StaffDocumentsService', () => {
  let service: StaffDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffDocumentsService],
    }).compile();

    service = module.get<StaffDocumentsService>(StaffDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
