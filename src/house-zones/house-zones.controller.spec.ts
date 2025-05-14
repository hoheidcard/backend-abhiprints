import { Test, TestingModule } from '@nestjs/testing';
import { HouseZonesController } from './house-zones.controller';
import { HouseZonesService } from './house-zones.service';

describe('HouseZonesController', () => {
  let controller: HouseZonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HouseZonesController],
      providers: [HouseZonesService],
    }).compile();

    controller = module.get<HouseZonesController>(HouseZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
