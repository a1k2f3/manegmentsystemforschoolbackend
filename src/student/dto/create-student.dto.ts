import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() dob: string;
  @IsNotEmpty() gender: string;
  @IsOptional() address?: string;
  @IsOptional() contact?: string;
  @IsOptional() father?: string;
  @IsOptional() mother?: string;
  @IsOptional() occupation?: string;
  @IsOptional() parentContact?: string;
  @IsOptional() previousSchool?: string;
  @IsOptional() lastGrade?: string;
  @IsOptional() currentGrade?: string;
}
