// src/assignment/assignment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { AssignmentController } from './assignment.controller';
// import { AssignmentService } from './assignment.service';
import { Assignment, AssignmentSchema } from './schemas/assignment.schema';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { AsgimentService } from './asgiment.service';
import { AsgimentController } from './asgiment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  controllers: [AsgimentController],
  providers: [AsgimentService],
  exports: [AsgimentService], // Export if other modules need it
})
export class AsgimentModule {}