import { Test, TestingModule } from '@nestjs/testing';
import { PrincipleController } from './principle.controller';

describe('PrincipleController', () => {
  let controller: PrincipleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrincipleController],
    }).compile();

    controller = module.get<PrincipleController>(PrincipleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
