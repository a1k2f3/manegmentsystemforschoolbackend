import { Module } from '@nestjs/common';
import { AsgimentService } from './asgiment.service';
import { AsgimentController } from './asgiment.controller';

@Module({
  providers: [AsgimentService],
  controllers: [AsgimentController]
})
export class AsgimentModule {}
