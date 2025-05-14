import { Test, TestingModule } from '@nestjs/testing';
import { HouseZonesService } from './house-zones.service';

describe('HouseZonesService', () => {
  let service: HouseZonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HouseZonesService],
    }).compile();

    service = module.get<HouseZonesService>(HouseZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
