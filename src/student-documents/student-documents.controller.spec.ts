import { Test, TestingModule } from '@nestjs/testing';
import { StudentDocumentsController } from './student-documents.controller';
import { StudentDocumentsService } from './student-documents.service';

describe('StudentDocumentsController', () => {
  let controller: StudentDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentDocumentsController],
      providers: [StudentDocumentsService],
    }).compile();

    controller = module.get<StudentDocumentsController>(StudentDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
