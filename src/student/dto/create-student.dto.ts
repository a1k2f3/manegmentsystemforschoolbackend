import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStudentDto {
  // ✅ Basic Information
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // ✅ Contact Info
  @IsOptional()
  @IsString()
  contact?: string;

  // ✅ Parent Information
  @IsOptional()
  @IsString()
  father?: string;

  @IsOptional()
  @IsString()
  mother?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  parentContact?: string;

  // ✅ Academic Information
  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsOptional()
  @IsString()
  lastGrade?: string;

  @IsOptional()
  @IsString()
  currentGrade?: string;

  // ✅ Account Info
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  // ✅ Status
  @IsOptional()
  @IsString()
  status?: string;

  // ✅ Uploaded Documents (optional)
  @IsOptional()
  @IsString()
  birthCertificate?: string;

  @IsOptional()
  @IsString()
  bForm?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  // ✅ Reference to School
  @IsNotEmpty()
  schoolId: Types.ObjectId; // required field
}
