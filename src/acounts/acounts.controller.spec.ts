import { Test, TestingModule } from '@nestjs/testing';
import { AcountsController } from './acounts.controller';

describe('AcountsController', () => {
  let controller: AcountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcountsController],
    }).compile();

    controller = module.get<AcountsController>(AcountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
