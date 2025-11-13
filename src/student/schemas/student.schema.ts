import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import { School } from 'src/school/schema/school.schema'; // import School schema

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
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
  @Prop({ default: 'inactive' }) status: string;

  @Prop({ unique: true }) studentId: number;

  @Prop({ required: true, unique: true, lowercase: true }) email: string;
  @Prop({ required: true }) password: string;

  @Prop() birthCertificate: string;
  @Prop() bForm: string;
  @Prop() photo: string;

  // ✅ Reference to School
  @Prop({ type: Types.ObjectId, ref: School.name, required: true })
  schoolId: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

// ✅ Auto-increment plugin for studentId
const AutoIncrement = AutoIncrementFactory(mongoose);
StudentSchema.plugin(AutoIncrement, { inc_field: 'studentId' });
