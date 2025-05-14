import { Test, TestingModule } from '@nestjs/testing';
import { DefaultSettingPermissionService } from './default-setting-permission.service';

describe('DefaultSettingPermissionService', () => {
  let service: DefaultSettingPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultSettingPermissionService],
    }).compile();

    service = module.get<DefaultSettingPermissionService>(DefaultSettingPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
