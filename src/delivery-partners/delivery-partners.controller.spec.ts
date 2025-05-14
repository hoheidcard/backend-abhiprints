import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPartnersController } from './delivery-partners.controller';
import { DeliveryPartnersService } from './delivery-partners.service';

describe('DeliveryPartnersController', () => {
  let controller: DeliveryPartnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPartnersController],
      providers: [DeliveryPartnersService],
    }).compile();

    controller = module.get<DeliveryPartnersController>(
      DeliveryPartnersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
