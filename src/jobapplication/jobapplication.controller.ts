import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { JobApplicationService } from './jobapplication.service';
import { CreateJobApplicationDto } from './dto/jobapplication.dto';
import { JobApplication } from './schemas/jobapplication.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('jobapplication')
export class JobApplicationController {
  constructor(private readonly jobAppService: JobApplicationService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + file.originalname;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateJobApplicationDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<JobApplication> {
    // Match file names by their fieldname (cv, degree, photo)
    const fileMap: Record<string, string> = {};
    files.forEach((file) => {
      if (file.fieldname === 'cv') fileMap.cv = file.filename;
      if (file.fieldname === 'degree') fileMap.degree = file.filename;
      if (file.fieldname === 'photo') fileMap.photo = file.filename;
    });

    const applicationData = { ...dto, ...fileMap };
    return this.jobAppService.create(applicationData);
  }

  @Get()
  async findAll(): Promise<JobApplication[]> {
    return this.jobAppService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobApplication> {
    return this.jobAppService.findOne(id);
  }
}
