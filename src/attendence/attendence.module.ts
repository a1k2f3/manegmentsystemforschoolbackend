// src/attendance/attendance.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from './attendence.service';
import { AttendanceController } from './attendence.controller';
import { Attendance, AttendanceSchema } from './schemas/attendance.schemas';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';
import { Class, ClassSchema } from 'src/class/schemas/class.schemas';
import { School, SchoolSchema } from 'src/school/schema/school.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Class.name, schema: ClassSchema },
      { name: School.name, schema: SchoolSchema },
    ]),
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
