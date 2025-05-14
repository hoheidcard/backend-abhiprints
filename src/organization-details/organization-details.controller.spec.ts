import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDetailsController } from './organization-details.controller';
import { OrganizationDetailsService } from './organization-details.service';

describe('OrganizationDetailsController', () => {
  let controller: OrganizationDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationDetailsController],
      providers: [OrganizationDetailsService],
    }).compile();

    controller = module.get<OrganizationDetailsController>(OrganizationDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
