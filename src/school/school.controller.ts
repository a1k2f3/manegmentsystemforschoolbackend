import { Controller, Get, Post, Patch, Delete, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { diskStorage } from 'multer';           // Add this import if needed
import { multerConfig } from '../config/multer.config'
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

 @Post('create')
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'registrationCertificate', maxCount: 1 },
      { name: 'noc', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ],
    multerConfig   // ← Pass the config here
  )
)
create(
  @Body() createSchoolDto: CreateSchoolDto,
  @UploadedFiles() files: {
    registrationCertificate?: Express.Multer.File[];
    noc?: Express.Multer.File[];
    logo?: Express.Multer.File[];
  } = {},
) {
  if (files.registrationCertificate?.[0]) {
    createSchoolDto.registrationCertificate = files.registrationCertificate[0].path;
  }
  if (files.noc?.[0]) {
    createSchoolDto.noc = files.noc[0].path;
  }
  if (files.logo?.[0]) {
    createSchoolDto.logo = files.logo[0].path;
  }

  return this.schoolService.create(createSchoolDto);
}

  @Get()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'registrationCertificate', maxCount: 1 },
      { name: 'noc', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ])
  )
  update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
    @UploadedFiles() files: {
      registrationCertificate?: Express.Multer.File[];
      noc?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    } = {},
  ) {
    if (files.registrationCertificate?.[0]?.path) {
      updateSchoolDto.registrationCertificate = files.registrationCertificate[0].path;
    }
    if (files.noc?.[0]?.path) {
      updateSchoolDto.noc = files.noc[0].path;
    }
    if (files.logo?.[0]?.path) {
      updateSchoolDto.logo = files.logo[0].path;
    }

    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(id);
  }
}