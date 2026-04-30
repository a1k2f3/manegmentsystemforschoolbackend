// src/assignment/schemas/assignment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Assignment extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string; // Manual questions or instructions

  @Prop()
  fileUrl: string; // If teacher uploads a PDF/Doc

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subject', required: true })
  subjectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true })
  teacherId: Types.ObjectId;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ default: 100 })
  totalMarks: number;
}
export const AssignmentSchema = SchemaFactory.createForClass(Assignment);