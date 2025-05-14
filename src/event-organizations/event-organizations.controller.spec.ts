import { Test, TestingModule } from '@nestjs/testing';
import { EventOrganizationsController } from './event-organizations.controller';
import { EventOrganizationsService } from './event-organizations.service';

describe('EventOrganizationsController', () => {
  let controller: EventOrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventOrganizationsController],
      providers: [EventOrganizationsService],
    }).compile();

    controller = module.get<EventOrganizationsController>(EventOrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
