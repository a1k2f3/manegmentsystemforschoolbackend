import { IsString, IsDateString, IsNumber, IsOptional, Min, IsMongoId } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name?: string;

  @IsString()
  type?: string;

  @IsDateString()
  date?: string;

  @IsString()
  time?: string;

  @IsString()
  venue?: string;

  @IsString()
  chiefGuest?: string;

  @IsNumber()
  @Min(1)
  totalSlots?: number;

  @IsMongoId()                    // ← Validates ObjectId format
  schoolId?: string;               // Accept as string, will be converted to ObjectId

  @IsOptional()
  @IsString()
  description?: string;
}