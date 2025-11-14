import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from './schemas/class.schemas';
import { School, SchoolSchema } from 'src/school/schema/school.schema';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { JobApplication, JobApplicationSchema } from 'src/jobapplication/schemas/jobapplication.schema';

@Module({
  imports: [
  MongooseModule.forFeature([
    { name: Class.name, schema: ClassSchema },
    { name: School.name, schema: SchoolSchema },
    { name: Student.name, schema: StudentSchema },
    { name: JobApplication.name, schema: JobApplicationSchema }, // ⭐ add this
  ]),
],

  controllers: [ClassController],
  providers: [ClassService]
})
export class ClassModule {}
