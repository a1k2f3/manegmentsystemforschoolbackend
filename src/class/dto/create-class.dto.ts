import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsString()
  className: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsNotEmpty()
  schoolId: string; // validated in service as ObjectId

  @IsOptional()
  @IsString()
  classTeacherId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
