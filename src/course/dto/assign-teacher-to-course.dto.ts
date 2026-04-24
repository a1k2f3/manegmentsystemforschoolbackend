import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignTeacherToCourseDto {
  @IsMongoId()
  @IsNotEmpty()
  teacher?: string;
}