import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignHodDto {
  @IsMongoId()
  @IsNotEmpty()
  hod: string;
}