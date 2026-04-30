// src/assignment/dto/create-assignment.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string; // For manual questions

  @IsMongoId()
  @IsNotEmpty()
  classId?: string;

  @IsMongoId()
  @IsNotEmpty()
  subjectId?: string;

  @IsMongoId()
  @IsNotEmpty()
  teacherId?: string;

  @IsDateString()
  @IsNotEmpty()
  deadline?: string; // Validates ISO date string format

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalMarks?: number;
}