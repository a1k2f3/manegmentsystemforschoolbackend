import { Test, TestingModule } from '@nestjs/testing';
import { JobapplicationService } from './jobapplication.service';

describe('JobapplicationService', () => {
  let service: JobapplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobapplicationService],
    }).compile();

    service = module.get<JobapplicationService>(JobapplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
