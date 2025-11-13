import { Controller, Get, Post, Patch, Delete, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'registrationCertificate', maxCount: 1 },
      { name: 'noc', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
    ])
  )
  create(@Body() createSchoolDto: CreateSchoolDto, @UploadedFiles() files: any) {
    if (files.registrationCertificate) createSchoolDto.registrationCertificate = files.registrationCertificate[0].path;
    if (files.noc) createSchoolDto.noc = files.noc[0].path;
    if (files.logo) createSchoolDto.logo = files.logo[0].path;
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
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto, @UploadedFiles() files: any) {
    if (files.registrationCertificate) updateSchoolDto.registrationCertificate = files.registrationCertificate[0].path;
    if (files.noc) updateSchoolDto.noc = files.noc[0].path;
    if (files.logo) updateSchoolDto.logo = files.logo[0].path;

    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolService.remove(id);
  }
}
