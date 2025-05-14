import { Test, TestingModule } from '@nestjs/testing';
import { StaffSubjectController } from './staff-subject.controller';
import { StaffSubjectService } from './staff-subject.service';

describe('StaffSubjectController', () => {
  let controller: StaffSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffSubjectController],
      providers: [StaffSubjectService],
    }).compile();

    controller = module.get<StaffSubjectController>(StaffSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
