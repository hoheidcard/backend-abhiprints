import { Test, TestingModule } from '@nestjs/testing';
import { ClassDivController } from './class-div.controller';
import { ClassDivService } from './class-div.service';

describe('ClassDivController', () => {
  let controller: ClassDivController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassDivController],
      providers: [ClassDivService],
    }).compile();

    controller = module.get<ClassDivController>(ClassDivController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
