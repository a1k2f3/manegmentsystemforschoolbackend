import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: './uploads/students',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.studentService.createStudent(createStudentDto, files);
  }

  // 🧾 Get all students
  @Get()
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  // 🔍 Get student by ID
  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }

  // 🔄 Update status (active / inactive)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'active' | 'inactive' },
  ) {
    return this.studentService.updateStatus(id, body.status);
  }
}
