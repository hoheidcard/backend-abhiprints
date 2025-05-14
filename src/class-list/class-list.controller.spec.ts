import { Test, TestingModule } from '@nestjs/testing';
import { ClassListController } from './class-list.controller';
import { ClassListService } from './class-list.service';

describe('ClassListController', () => {
  let controller: ClassListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassListController],
      providers: [ClassListService],
    }).compile();

    controller = module.get<ClassListController>(ClassListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
