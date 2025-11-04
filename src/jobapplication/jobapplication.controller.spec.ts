import { Test, TestingModule } from '@nestjs/testing';
import { JobapplicationController } from './jobapplication.controller';

describe('JobapplicationController', () => {
  let controller: JobapplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobapplicationController],
    }).compile();

    controller = module.get<JobapplicationController>(JobapplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
