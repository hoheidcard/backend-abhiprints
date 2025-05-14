import { Test, TestingModule } from '@nestjs/testing';
import { DefaultSettingsService } from './default-settings.service';

describe('DefaultSettingsService', () => {
  let service: DefaultSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultSettingsService],
    }).compile();

    service = module.get<DefaultSettingsService>(DefaultSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
