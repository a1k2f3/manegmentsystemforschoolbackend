// dto/update-status.dto.ts
import { IsEnum } from 'class-validator';
import { JobApplicationStatus } from '../schemas/jobapplication.schema';

export class UpdateStatusDto {
  @IsEnum(JobApplicationStatus)
  status?: JobApplicationStatus;
}