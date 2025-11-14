// src/attendance/dto/create-attendance.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  classId: string;

  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @IsNotEmpty()
  @IsString()
  status: 'present' | 'absent' | 'leave';
}
