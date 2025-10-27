import { Test, TestingModule } from '@nestjs/testing';
import { TestsesionService } from './testsesion.service';

describe('TestsesionService', () => {
  let service: TestsesionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestsesionService],
    }).compile();

    service = module.get<TestsesionService>(TestsesionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
