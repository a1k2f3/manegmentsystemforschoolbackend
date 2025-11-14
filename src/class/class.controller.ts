import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  async create(@Body() dto: CreateClassDto) {
    return this.classService.create(dto);
  }

  @Get()
  async getAll() {
    return this.classService.findAll();
  }

  // classes for a school — placed before dynamic :id to avoid route conflicts
  @Get('school/:schoolId')
  async getBySchool(@Param('schoolId') schoolId: string) {
    return this.classService.findBySchool(schoolId);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.classService.update(id, dto);
  }
@Post(':classId/add-student/:studentId')
addStudent(
  @Param('classId') classId: string,
  @Param('studentId') studentId: string,
) {
  return this.classService.addStudentToClass(classId, studentId);
}
@Post(':classId/assign-job/:jobAppId')
assignJob(
  @Param('classId') classId: string,
  @Param('jobAppId') jobAppId: string,
) {
  return this.classService.assignClassJobApplication(classId, jobAppId);
}
// Remove student from class
@Delete(':classId/remove-student/:studentId')
removeStudent(
  @Param('classId') classId: string,
  @Param('studentId') studentId: string,
) {
  return this.classService.removeStudentFromClass(classId, studentId);
}

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
