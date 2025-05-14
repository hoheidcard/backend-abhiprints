import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPartnersService } from './delivery-partners.service';

describe('DeliveryPartnersService', () => {
  let service: DeliveryPartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryPartnersService],
    }).compile();

    service = module.get<DeliveryPartnersService>(DeliveryPartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
