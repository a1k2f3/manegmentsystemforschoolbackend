import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min, 
  Max 
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsString()
  @IsNotEmpty()
  category?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  pages?: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price?: number;

  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  pdfPath?: string;
}