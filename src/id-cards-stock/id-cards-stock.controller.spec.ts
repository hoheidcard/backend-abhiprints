import { Test, TestingModule } from '@nestjs/testing';
import { IdCardsStockController } from './id-cards-stock.controller';
import { IdCardsStockService } from './id-cards-stock.service';

describe('IdCardsStockController', () => {
  let controller: IdCardsStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdCardsStockController],
      providers: [IdCardsStockService],
    }).compile();

    controller = module.get<IdCardsStockController>(IdCardsStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
