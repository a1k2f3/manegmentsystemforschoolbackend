import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { JobApplicationService } from './jobapplication.service';
import { CreateJobApplicationDto } from './dto/jobapplication.dto';
import { JobApplication } from './schemas/jobapplication.schema';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Patch } from '@nestjs/common';
import { UpdateStatusDto } from './dto/update-status.dto';

import { extname } from 'path';
// import { Query } from 'mongoose';

@Controller('jobapplication')
export class JobApplicationController {
  constructor(private readonly jobAppService: JobApplicationService) {}

 @Post()
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'cv', maxCount: 1 },
      { name: 'degree', maxCount: 1 },
      { name: 'photo', maxCount: 1 },
    ],
    {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    },
  ),
)
async create(
  @Body() dto: CreateJobApplicationDto,
  @UploadedFiles()
  files: {
    cv?: Express.Multer.File[];
    degree?: Express.Multer.File[];
    photo?: Express.Multer.File[];
  },
): Promise<JobApplication> {

  // ✅ DEBUG (remove later)
  console.log('DTO:', dto);

  const applicationData = {
    ...dto,
    cv: files?.cv?.[0]?.filename,
    degree: files?.degree?.[0]?.filename,
    photo: files?.photo?.[0]?.filename,
  };

  // ✅ DEBUG (remove later)
  console.log('Application Data:', applicationData);

  return this.jobAppService.create(applicationData);
}
@Get('school')
async getBySchool(@Query('schoolId') schoolId: string) {
  return this.jobAppService.getteacherBySchool(schoolId);
}
  @Get()
  async findAll(): Promise<JobApplication[]> {
    return this.jobAppService.findAll();
  }
@Patch(':id/status')
async updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateStatusDto,
) {
  const { status } = dto;
  if (!status) {
    throw new BadRequestException('Status is required');
  }
  return this.jobAppService.updateStatus(id, status);
}
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobApplication> {
    return this.jobAppService.findOne(id);
  }
}
