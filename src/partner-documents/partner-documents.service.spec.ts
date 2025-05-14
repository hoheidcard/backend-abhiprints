import { Test, TestingModule } from '@nestjs/testing';
import { PartnerDocumentsService } from './partner-documents.service';

describe('PartnerDocumentsService', () => {
  let service: PartnerDocumentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerDocumentsService],
    }).compile();

    service = module.get<PartnerDocumentsService>(PartnerDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
