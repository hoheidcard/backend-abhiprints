import { Test, TestingModule } from '@nestjs/testing';
import { StaffDepartmentController } from './staff-department.controller';
import { StaffDepartmentService } from './staff-department.service';

describe('StaffDepartmentController', () => {
  let controller: StaffDepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffDepartmentController],
      providers: [StaffDepartmentService],
    }).compile();

    controller = module.get<StaffDepartmentController>(StaffDepartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
