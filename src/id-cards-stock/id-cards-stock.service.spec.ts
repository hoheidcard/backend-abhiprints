import { Test, TestingModule } from '@nestjs/testing';
import { IdCardsStockService } from './id-cards-stock.service';

describe('IdCardsStockService', () => {
  let service: IdCardsStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdCardsStockService],
    }).compile();

    service = module.get<IdCardsStockService>(IdCardsStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
