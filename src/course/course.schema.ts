import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true, trim: true })
  name: string;                     // "Mathematics 2025-2026", "Biology (FSc Pre-Medical)"

  @Prop({ required: true, trim: true, uppercase: true })
  code: string;                     // "MATH-2025", "BIO-FSC"

  @Prop({ required: true, trim: true })
  academicYear: string;             // "2025-2026"

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })  // link to base Subject
  subject: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: false })
  department?: Types.ObjectId;      // optional – Science, Commerce, etc.

  @Prop([{ type: Types.ObjectId, ref: 'Teacher' }])
  teachers: Types.ObjectId[];       // can have multiple (main + assistants)

  @Prop([{ type: Types.ObjectId, ref: 'Student' }])
  students: Types.ObjectId[];       // enrolled students

  @Prop([{ type: Types.ObjectId, ref: 'Class' }])  // or Section
  classes: Types.ObjectId[];        // which class(es)/section(s) this course serves

  @Prop({ default: 0 })
  periodsPerWeek: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: 80 })
  maxCapacity: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  deactivatedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ school: 1, academicYear: 1, subject: 1, code: 1 }, { unique: true });