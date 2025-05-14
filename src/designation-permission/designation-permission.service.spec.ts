import { Test, TestingModule } from '@nestjs/testing';
import { DesignationPermissionService } from './designation-permission.service';

describe('DesignationPermissionService', () => {
  let service: DesignationPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignationPermissionService],
    }).compile();

    service = module.get<DesignationPermissionService>(DesignationPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
