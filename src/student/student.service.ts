import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<Student>) {}

  async createStudent(createStudentDto: CreateStudentDto, files: Express.Multer.File[]) {
    const [birthCertificate, bForm, photo] = files;

    const newStudent = new this.studentModel({
      ...createStudentDto,
      birthCertificate: birthCertificate?.path,
      bForm: bForm?.path,
      photo: photo?.path,
      status: 'inactive', // default
    });

    return await newStudent.save();
  }

  // 🔍 Get student details by ID
  async getStudentById(id: string) {
    const student = await this.studentModel.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }
async getAllStudents() {
  const students = await this.studentModel.find().sort({ createdAt: -1 });
  return students;
}

  // 🔄 Update student status (active / inactive)
  async updateStatus(id: string, status: 'active' | 'inactive') {
    const student = await this.studentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }
}
