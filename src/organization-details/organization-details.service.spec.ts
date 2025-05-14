import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDetailsService } from './organization-details.service';

describe('OrganizationDetailsService', () => {
  let service: OrganizationDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationDetailsService],
    }).compile();

    service = module.get<OrganizationDetailsService>(OrganizationDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
