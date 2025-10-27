import { Test, TestingModule } from '@nestjs/testing';
import { AsgimentService } from './asgiment.service';

describe('AsgimentService', () => {
  let service: AsgimentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsgimentService],
    }).compile();

    service = module.get<AsgimentService>(AsgimentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
