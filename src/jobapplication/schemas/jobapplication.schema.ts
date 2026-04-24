import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { School } from '../../school/schema/school.schema';

export enum JobApplicationStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  SHORTLISTED = 'shortlisted',
  ACCEPTED = 'accepted',
}

@Schema({ timestamps: true })
export class JobApplication extends Document {
  @Prop({ required: true })
  name?: string;

  @Prop({ required: true })
  email?: string;

  @Prop({ required: true })
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  position?: string;

  @Prop()
  gender?: string;

  @Prop()
  qualification?: string;

  @Prop()
  university?: string;

  @Prop()
  yearOfPassing?: string;

  @Prop()
  cgpa?: string;

  @Prop()
  lastJob?: string;

  @Prop()
  yearsOfExperience?: string;

  @Prop()
  skills?: string;

  // Files
  @Prop()
  cv?: string;

  @Prop()
  degree?: string;

  @Prop()
  photo?: string;

  // ✅ ENUM STATUS
  @Prop({
    enum: JobApplicationStatus,
    default: JobApplicationStatus.PENDING,
  })
  status?: JobApplicationStatus;

  @Prop({ type: Types.ObjectId, ref: School.name, required: true })
  schoolId?: Types.ObjectId;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);