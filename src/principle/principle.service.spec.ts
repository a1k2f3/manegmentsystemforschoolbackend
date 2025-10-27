import { Test, TestingModule } from '@nestjs/testing';
import { PrincipleService } from './principle.service';

describe('PrincipleService', () => {
  let service: PrincipleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrincipleService],
    }).compile();

    service = module.get<PrincipleService>(PrincipleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
