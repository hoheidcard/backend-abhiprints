import { Test, TestingModule } from '@nestjs/testing';
import { PartnerDocumentsController } from './partner-documents.controller';
import { PartnerDocumentsService } from './partner-documents.service';

describe('PartnerDocumentsController', () => {
  let controller: PartnerDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerDocumentsController],
      providers: [PartnerDocumentsService],
    }).compile();

    controller = module.get<PartnerDocumentsController>(PartnerDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
