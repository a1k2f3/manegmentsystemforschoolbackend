import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  UseInterceptors,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  // 🔐 Student login
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.studentService.login(email, password);
  }

  // 🧾 Create new student (registration) with file uploads
  @Post('create')
  @UseInterceptors(
  FileFieldsInterceptor([
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'bForm', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ], {
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

  // 🔍 Get all students
  @Get()
  async getAllStudents() {
    return this.studentService.getAllStudents();
  }

  // 🔍 Get students by school
@Get('school/:id')
async getBySchool(@Param('id') schoolId: string) { // Removed the colon here
  return this.studentService.getStudentsBySchool(schoolId);
}
  // 🔍 Get student by ID
  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }

  // 🔄 Update student status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'active' | 'inactive' },
  ) {
    return this.studentService.updateStatus(id, body.status);
  }

  // 🔄 Update student details with optional file uploads
  @Patch(':id')
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
  async updateStudent(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateStudentDto>,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.studentService.updateStudent(id, updateData, files);
  }

  // ❌ Delete student
  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
