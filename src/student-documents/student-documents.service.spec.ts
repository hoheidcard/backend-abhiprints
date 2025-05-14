import { Test, TestingModule } from '@nestjs/testing';
import { StudentDocumentsService } from './student-documents.service';

describe('StudentDocumentsService', () => {
  let service: StudentDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentDocumentsService],
    }).compile();

    service = module.get<StudentDocumentsService>(StudentDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
