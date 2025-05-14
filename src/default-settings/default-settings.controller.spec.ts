import { Test, TestingModule } from '@nestjs/testing';
import { DefaultSettingsController } from './default-settings.controller';
import { DefaultSettingsService } from './default-settings.service';

describe('DefaultSettingsController', () => {
  let controller: DefaultSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultSettingsController],
      providers: [DefaultSettingsService],
    }).compile();

    controller = module.get<DefaultSettingsController>(DefaultSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
