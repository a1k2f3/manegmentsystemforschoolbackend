import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CoursesService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherToCourseDto } from './dto/assign-teacher-to-course.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post('create')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(
    @Query('schoolId') schoolId?: string,
    @Query('academicYear') academicYear?: string,
    // @Query('subjectId') subjectId?: string,
   
  ) {
    return this.coursesService.findAll(schoolId, academicYear,);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
@Get('teacher/:teacherId')
async findByTeacher(
  @Param('teacherId') teacherId: string,
  @Query('academicYear') academicYear?: string,
) {
  return this.coursesService.findAllByTeacher(teacherId, academicYear);
}
  @Patch(':id/teachers')
  addTeacher(@Param('id') id: string, @Body() dto: AssignTeacherToCourseDto) {
    return this.coursesService.addTeacher(id, dto);
  }

  @Delete(':id/teachers/:teacherId')
  removeTeacher(@Param('id') id: string, @Param('teacherId') teacherId: string) {
    return this.coursesService.removeTeacher(id, teacherId);
  }

  @Patch(':id/enroll')
  enrollStudent(@Param('id') id: string, @Body() dto: EnrollStudentDto) {
    return this.coursesService.enrollStudent(id, dto);
  }

  @Delete(':id/students/:studentId')
  unenrollStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    return this.coursesService.unenrollStudent(id, studentId);
  }
}