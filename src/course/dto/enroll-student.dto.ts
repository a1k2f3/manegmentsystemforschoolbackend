import { IsMongoId, IsNotEmpty } from 'class-validator';

export class EnrollStudentDto {
  @IsMongoId()
  @IsNotEmpty()
  student: string;
}