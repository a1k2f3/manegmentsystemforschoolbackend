import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';

@Module({
  providers: [AttendenceService],
  controllers: [AttendenceController]
})
export class AttendenceModule {}
