import { Test, TestingModule } from '@nestjs/testing';
import { SubPartnerDetailsService } from './sub-partner-details.service';

describe('SubPartnerDetailsService', () => {
  let service: SubPartnerDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubPartnerDetailsService],
    }).compile();

    service = module.get<SubPartnerDetailsService>(SubPartnerDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
