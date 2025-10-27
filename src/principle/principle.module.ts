import { Module } from '@nestjs/common';
import { PrincipleController } from './principle.controller';
import { PrincipleService } from './principle.service';

@Module({
  controllers: [PrincipleController],
  providers: [PrincipleService]
})
export class PrincipleModule {}
