import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true }) schoolName: string;
  @Prop({ required: true }) principalName: string;
  @Prop({ required: true }) principalEmail: string;
  @Prop({ required: true }) contactPhone: string;
  @Prop({required:true })password:string;
  @Prop() website?: string;
  @Prop({ required: true }) registrationNumber: string;
  @Prop({ required: true }) establishedYear: number;
  @Prop({ required: true, enum: ['public', 'private', 'charter'] }) schoolType: string;
  @Prop({ required: true }) addressLine1: string;
  @Prop() addressLine2?: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) state: string;
  @Prop({ required: true }) postcode: string;
  @Prop() affiliationBoard?: string;
  @Prop() accreditationNumber?: string;
  @Prop() totalStudents?: number;
  @Prop() totalTeachers?: number;
  @Prop() registrationCertificate?: string;
  @Prop() noc?: string;
  @Prop() logo?: string;
  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] }) status: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
