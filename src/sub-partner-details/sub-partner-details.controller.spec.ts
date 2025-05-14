import { Test, TestingModule } from '@nestjs/testing';
import { SubPartnerDetailsController } from './sub-partner-details.controller';
import { SubPartnerDetailsService } from './sub-partner-details.service';

describe('SubPartnerDetailsController', () => {
  let controller: SubPartnerDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubPartnerDetailsController],
      providers: [SubPartnerDetailsService],
    }).compile();

    controller = module.get<SubPartnerDetailsController>(SubPartnerDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
