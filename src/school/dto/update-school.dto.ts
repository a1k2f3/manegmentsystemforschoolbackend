import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from './create-school.dto';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  // PartialType makes all fields optional for update
  status?: 'pending' | 'approved' | 'rejected';
}
