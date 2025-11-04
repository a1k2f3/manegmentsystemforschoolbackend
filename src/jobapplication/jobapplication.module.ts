import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { JobApplicationController } from './jobapplication.controller';
import { JobApplicationController } from './jobapplication.controller';
import { JobApplicationService } from './jobapplication.service';
import { JobApplication, JobApplicationSchema } from './jobapplication.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
    ]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
