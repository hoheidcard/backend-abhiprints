import { Test, TestingModule } from '@nestjs/testing';
import { EventOrganizationsService } from './event-organizations.service';

describe('EventOrganizationsService', () => {
  let service: EventOrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventOrganizationsService],
    }).compile();

    service = module.get<EventOrganizationsService>(EventOrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
