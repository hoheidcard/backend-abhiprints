import { Test, TestingModule } from '@nestjs/testing';
import { PartnerDetailsController } from './partner-details.controller';
import { PartnerDetailsService } from './partner-details.service';

describe('PartnerDetailsController', () => {
  let controller: PartnerDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerDetailsController],
      providers: [PartnerDetailsService],
    }).compile();

    controller = module.get<PartnerDetailsController>(PartnerDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
