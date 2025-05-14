import { Test, TestingModule } from '@nestjs/testing';
import { DefaultSettingPermissionController } from './default-setting-permission.controller';
import { DefaultSettingPermissionService } from './default-setting-permission.service';

describe('DefaultSettingPermissionController', () => {
  let controller: DefaultSettingPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultSettingPermissionController],
      providers: [DefaultSettingPermissionService],
    }).compile();

    controller = module.get<DefaultSettingPermissionController>(DefaultSettingPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
