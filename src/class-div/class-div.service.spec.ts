import { Test, TestingModule } from '@nestjs/testing';
import { ClassDivService } from './class-div.service';

describe('ClassDivService', () => {
  let service: ClassDivService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassDivService],
    }).compile();

    service = module.get<ClassDivService>(ClassDivService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
