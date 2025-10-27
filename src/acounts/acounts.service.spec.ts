import { Test, TestingModule } from '@nestjs/testing';
import { AcountsService } from './acounts.service';

describe('AcountsService', () => {
  let service: AcountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcountsService],
    }).compile();

    service = module.get<AcountsService>(AcountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
