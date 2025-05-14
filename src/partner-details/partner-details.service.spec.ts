import { Test, TestingModule } from '@nestjs/testing';
import { PartnerDetailsService } from './partner-details.service';

describe('PartnerDetailsService', () => {
  let service: PartnerDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerDetailsService],
    }).compile();

    service = module.get<PartnerDetailsService>(PartnerDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
