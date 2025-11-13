import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true }) name: string;
  @Prop() dob: string;
  @Prop() gender: string;
  @Prop() address: string;
  @Prop() contact: string;
  @Prop() father: string;
  @Prop() mother: string;
  @Prop() occupation: string;
  @Prop() parentContact: string;
  @Prop() previousSchool: string;
  @Prop() lastGrade: string;
  @Prop() currentGrade: string;
@Prop({ default: 'inactive' }) status: string; //
  // File paths
  @Prop() birthCertificate: string;
  @Prop() bForm: string;
  @Prop() photo: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
