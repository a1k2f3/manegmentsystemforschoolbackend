import { Test, TestingModule } from '@nestjs/testing';
import { TestsesionController } from './testsesion.controller';

describe('TestsesionController', () => {
  let controller: TestsesionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsesionController],
    }).compile();

    controller = module.get<TestsesionController>(TestsesionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
