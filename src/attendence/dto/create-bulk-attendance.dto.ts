// src/attendance/dto/create-bulk-attendance.dto.ts
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SingleAttendanceDto {
  @IsMongoId()
  @IsNotEmpty()
  student?: string;

  @IsMongoId()
  @IsNotEmpty()
  classId?: string;

  @IsMongoId()
  @IsNotEmpty()
  schoolId?: string;

  @IsEnum(['present', 'absent', 'leave'])
  @IsNotEmpty()
  status?: string;

  @IsOptional()
  date?: Date;
}

export class CreateBulkAttendanceDto {
  @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SingleAttendanceDto)
    records!: SingleAttendanceDto[];
}