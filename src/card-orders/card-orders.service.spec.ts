import { Test, TestingModule } from '@nestjs/testing';
import { CardOrdersService } from './card-orders.service';

describe('CardOrdersService', () => {
  let service: CardOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardOrdersService],
    }).compile();

    service = module.get<CardOrdersService>(CardOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
