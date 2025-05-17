import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('API responses', () => {
    it('should return "Hello Nest!"', () => {
      expect(appController.getHello()).toBe('Hello Nest!');
    });

    it('should return API health status', () => {
      expect(appController.checkHealth()).toBe('API is running smoothly!');
    });
  });
});
