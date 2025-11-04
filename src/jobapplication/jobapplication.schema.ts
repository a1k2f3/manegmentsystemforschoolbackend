import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class JobApplication extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address: string;

  @Prop()
  position: string;

  @Prop()
  gender: string;

  @Prop()
  qualification: string;

  @Prop()
  university: string;

  @Prop()
  yearOfPassing: string;

  @Prop()
  cgpa: string;

  @Prop()
  lastJob: string;

  @Prop()
  yearsOfExperience: string;

  @Prop()
  skills: string;

  // New fields for uploaded file URLs
  @Prop()
  cv: string;

  @Prop()
  degree: string;

  @Prop()
  photo: string;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
