import { Test, TestingModule } from '@nestjs/testing';
import { DesignationPermissionController } from './designation-permission.controller';
import { DesignationPermissionService } from './designation-permission.service';

describe('DesignationPermissionController', () => {
  let controller: DesignationPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignationPermissionController],
      providers: [DesignationPermissionService],
    }).compile();

    controller = module.get<DesignationPermissionController>(DesignationPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
