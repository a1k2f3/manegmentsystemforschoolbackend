// src/assignment/dto/mark-submission.dto.ts
import { IsNumber, IsString, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class MarkSubmissionDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  obtainedMarks?: number;
  @IsString()
  @IsOptional()
  teacherFeedback?: string;
}