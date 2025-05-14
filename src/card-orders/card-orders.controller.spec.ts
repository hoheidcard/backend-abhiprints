import { Test, TestingModule } from '@nestjs/testing';
import { CardOrdersController } from './card-orders.controller';
import { CardOrdersService } from './card-orders.service';

describe('CardOrdersController', () => {
  let controller: CardOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardOrdersController],
      providers: [CardOrdersService],
    }).compile();

    controller = module.get<CardOrdersController>(CardOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
