import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // 🧾 Create new student (Registration)
  async createStudent(createStudentDto: CreateStudentDto, files?: Express.Multer.File[]) {
    try {
      const [birthCertificate, bForm, photo] = files || [];

      // Validate schoolId
      if (!Types.ObjectId.isValid(createStudentDto.schoolId)) {
        throw new BadRequestException('Invalid school ID');
      }

      // Check if email already exists
      const existingStudent = await this.studentModel.findOne({
        email: createStudentDto.email,
      });
      if (existingStudent) throw new BadRequestException('Email already registered');

      // Hash the password
      const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

      const newStudent = new this.studentModel({
        ...createStudentDto,
        password: hashedPassword,
        birthCertificate: birthCertificate?.path || null,
        bForm: bForm?.path || null,
        photo: photo?.path || null,
        status: 'inactive',
      });

      const savedStudent = await newStudent.save();
      return {
        message: 'Student registered successfully',
        student: savedStudent,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // 🔐 Login Student
  async login(email: string, password: string) {
    const student = await this.studentModel.findOne({ email });
    if (!student) throw new NotFoundException('Student not found');

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // Generate JWT token
    const token = await this.jwtService.signAsync({
      id: student._id,
      email: student.email,
      name: student.name,
    });

    return {
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status,
        schoolId: student.schoolId, // include school reference
      },
    };
  }

  // 🔍 Get all students
  async getAllStudents() {
    return await this.studentModel
      .find()
      .populate('schoolId') // populate school details
      .sort({ createdAt: -1 });
  }

  // 🔍 Get student by ID
  async getStudentById(id: string) {
    const student = await this.studentModel.findById(id).populate('schoolId');
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  // 🔄 Update student status
  async updateStatus(id: string, status: 'active' | 'inactive') {
    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updatedStudent) throw new NotFoundException('Student not found');
    return updatedStudent;
  }

  // 🔄 Update student details
  async updateStudent(
    id: string,
    updateData: Partial<CreateStudentDto>,
    files?: Express.Multer.File[],
  ) {
    const student = await this.studentModel.findById(id);
    if (!student) throw new NotFoundException('Student not found');

    const [birthCertificate, bForm, photo] = files || [];

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        birthCertificate: birthCertificate?.path || student.birthCertificate,
        bForm: bForm?.path || student.bForm,
        photo: photo?.path || student.photo,
      },
      { new: true },
    );

    return updatedStudent;
  }
// 🔍 Get all students of a specific school
async getStudentsBySchool(schoolId: string) {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new BadRequestException('Invalid school ID');
  }

  const students = await this.studentModel
    .find({ schoolId })
    .populate('schoolId') // optional: populate school details
    .sort({ createdAt: -1 });

  return students;
}

  // ❌ Delete student
  async deleteStudent(id: string) {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id);
    if (!deletedStudent) throw new NotFoundException('Student not found');
    return { message: 'Student deleted successfully' };
  }
}
