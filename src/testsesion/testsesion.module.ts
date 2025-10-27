import { Module } from '@nestjs/common';
import { TestsesionService } from './testsesion.service';
import { TestsesionController } from './testsesion.controller';

@Module({
  providers: [TestsesionService],
  controllers: [TestsesionController]
})
export class TestsesionModule {}
