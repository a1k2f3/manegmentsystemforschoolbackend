import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true })
  className: string;

  @Prop()
  section?: string;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  // ⭐ Reference to Job Application (instead of Teacher)
  @Prop({ type: Types.ObjectId, ref: 'JobApplication', required: false })
  jobApplicationId?: Types.ObjectId;

  // ⭐ Reference to Students
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Student' }], default: [] })
  studentIds: Types.ObjectId[];

  @Prop({ default: 0 })
  strength: number;

  @Prop({ default: 'active' })
  status?: string;

  @Prop()
  description?: string;

  @Prop()
  roomNumber?: string;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
