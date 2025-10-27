import { Test, TestingModule } from '@nestjs/testing';
import { AsgimentController } from './asgiment.controller';

describe('AsgimentController', () => {
  let controller: AsgimentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsgimentController],
    }).compile();

    controller = module.get<AsgimentController>(AsgimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
