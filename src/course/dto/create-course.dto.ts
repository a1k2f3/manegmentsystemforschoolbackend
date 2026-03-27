import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  code: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @IsMongoId()
  @IsNotEmpty()
  school: string;

  @IsMongoId()
  @IsNotEmpty()
  subject: string;

  @IsMongoId()
  @IsOptional()
  department?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  teachers?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  classes?: string[];

  @IsNumber()
  @Min(1)
  @IsOptional()
  periodsPerWeek?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(10)
  @IsOptional()
  maxCapacity?: number;
}