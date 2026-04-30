// src/assignment/dto/submit-assignment.dto.ts
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SubmitAssignmentDto {
  @IsMongoId()
  @IsNotEmpty()
  assignmentId?: string;

  @IsMongoId()
  @IsNotEmpty()
  studentId?: string;
}