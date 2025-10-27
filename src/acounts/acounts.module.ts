import { Module } from '@nestjs/common';
import { AcountsService } from './acounts.service';
import { AcountsController } from './acounts.controller';

@Module({
  providers: [AcountsService],
  controllers: [AcountsController]
})
export class AcountsModule {}
