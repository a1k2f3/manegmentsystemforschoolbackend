import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types,Document } from "mongoose";

// src/assignment/schemas/submission.schema.ts
@Schema({ timestamps: true })
export class Submission extends Document  {
  @Prop({ type: Types .ObjectId, ref: 'Assignment', required: true })
  assignmentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId?: Types.ObjectId;

  @Prop({ required: true })
  fileUrl?: string; // Student's uploaded work

  @Prop({ default: 0 })
  obtainedMarks?: number;

  @Prop({ default: 'pending' }) // pending, marked
  status?: string;

  @Prop()
  teacherFeedback?: string;
}
export const SubmissionSchema = SchemaFactory.createForClass(Submission);