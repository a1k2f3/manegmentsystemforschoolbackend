// src/attendance/schemas/attendance.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Student } from 'src/student/schemas/student.schema';
import { Class } from 'src/class/schemas/class.schemas';
import { School } from 'src/school/schema/school.schema';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
  student: Student;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true })
  classId: Class;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true })
  schoolId: School;

  @Prop({ required: true, enum: ['present', 'absent', 'leave'], default: 'present' })
  status: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
