import { IsString } from 'class-validator';

export class BookEventDto {
  @IsString()
  studentId?: string;
}