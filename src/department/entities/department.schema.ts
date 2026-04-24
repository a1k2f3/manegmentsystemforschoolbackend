import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Department extends Document {
  @Prop({ required: true, trim: true, unique: true })
  name?: string; // e.g. "Computer Science", "Electrical Engineering"

  @Prop({ required: true, trim: true })
  code?: string; // e.g. "CS", "EE", "BBA"

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  school?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Teacher', default: null })
  hod?: Types.ObjectId; // Head of Department

  @Prop([{ type: Types.ObjectId, ref: 'Teacher' }])
  teachers?: Types.ObjectId[];

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: Date, default: null })
  deactivatedAt?: Date;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

// Optional: compound index
DepartmentSchema.index({ school: 1, code: 1 }, { unique: true });