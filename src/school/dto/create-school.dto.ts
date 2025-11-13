import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsString() schoolName: string;
  @IsString() principalName: string;
  @IsEmail() principalEmail: string;
  
  @IsString() contactPhone: string;
  @IsOptional() @IsString() website?: string;
  @IsString() registrationNumber: string;
  @IsNumber() establishedYear: number;
  @IsEnum(['public', 'private', 'charter']) schoolType: string;
  @IsString() addressLine1: string;
  @IsString() password: string;
  @IsOptional() @IsString() addressLine2?: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() postcode: string;
  @IsOptional() @IsString() affiliationBoard?: string;
  @IsOptional() @IsString() accreditationNumber?: string;
  @IsOptional() @IsNumber() totalStudents?: number;
  @IsOptional() @IsNumber() totalTeachers?: number;
  @IsOptional() @IsString() registrationCertificate?: string;
  @IsOptional() @IsString() noc?: string;
  @IsOptional() @IsString() logo?: string;
}
