import { IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  code: string;

  @IsMongoId()
  @IsNotEmpty()
  school: string;

  @IsMongoId()
  @IsOptional()
  hod?: string;

  @IsString()
  @IsOptional()
  description?: string;
}