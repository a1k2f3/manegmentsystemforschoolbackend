import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { JobApplicationController } from './jobapplication.controller';
import { JobApplicationController } from './jobapplication.controller';
import { JobApplicationService } from './jobapplication.service';
import { JobApplication, JobApplicationSchema } from './schemas/jobapplication.schema';
import { School, SchoolSchema } from '../school/schema/school.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema }
      ,{ name: School.name, schema: SchoolSchema },
    ]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
