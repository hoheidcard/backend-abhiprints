import { Test, TestingModule } from '@nestjs/testing';
import { StaffDocumentsController } from './staff-documents.controller';
import { StaffDocumentsService } from './staff-documents.service';

describe('StaffDocumentsController', () => {
  let controller: StaffDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffDocumentsController],
      providers: [StaffDocumentsService],
    }).compile();

    controller = module.get<StaffDocumentsController>(StaffDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
