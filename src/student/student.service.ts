import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
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
async createStudent(createStudentDto: CreateStudentDto, files?: any) {
  try {
    const { email, password, schoolId, classId } = createStudentDto;

    // 1. Ensure IDs exist AND are valid ObjectIds
    // This check satisfies TypeScript because it confirms the variables aren't undefined
    if (!schoolId || !classId || !Types.ObjectId.isValid(schoolId) || !Types.ObjectId.isValid(classId)) {
      throw new BadRequestException('School ID and Class ID are required and must be valid');
    }

    // 2. Check if email already exists
    const existingStudent = await this.studentModel.findOne({ email });
    if (existingStudent) {
      throw new BadRequestException('Email already registered');
    }

    // 3. Extract file paths securely
    const birthCertificate = files?.birthCertificate?.[0]?.path || null;
    const bForm = files?.bForm?.[0]?.path || null;
    const photo = files?.photo?.[0]?.path || null;

    // 4. Hash the password (check if password exists to satisfy TS)
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new instance
    // We use "as string" here because our check above guaranteed they aren't undefined
    const newStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
      schoolId: new Types.ObjectId(schoolId as string),
      classId: new Types.ObjectId(classId as string),
      birthCertificate,
      bForm,
      photo,
      status: 'inactive',
    });

    const savedStudent = await newStudent.save();

    return {
      message: 'Student registered successfully',
      student: savedStudent,
    };

  } catch (error: any) {
    if (error.code === 11000) {
      throw new BadRequestException('Unique constraint violation (Email or StudentId)');
    }

    if (error.message?.includes('buffering timed out')) {
      throw new InternalServerErrorException('Database connection lost or too slow');
    }

    // Re-throw the original BadRequestException if it was one of ours
    if (error instanceof BadRequestException) {
      throw error;
    }

    throw new BadRequestException(error?.message || 'Registration failed');
  }
}
  // 🔐 Login Student
  async login(email: string, password: string) {
    const student = await this.studentModel.findOne({ email:email });
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
    files?: any,
  ) {
    const student = await this.studentModel.findById(id);
    if (!student) throw new NotFoundException('Student not found');

    const birthCertificate = files?.birthCertificate?.[0]?.path || student.birthCertificate;
    const bForm = files?.bForm?.[0]?.path || student.bForm;
    const photo = files?.photo?.[0]?.path || student.photo;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        birthCertificate,
        bForm,
        photo,
      },
      { new: true },
    );

    return updatedStudent;
  }
// 🔍 Get all students of a specific school
async getStudentsBySchool(schoolId: string) {
  // 1. Validate format
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new BadRequestException('Invalid school ID format');
  }

  // 2. Explicitly convert to ObjectId for the query
  const students = await this.studentModel
    .find({ schoolId: new Types.ObjectId(schoolId) }) // Explicit cast
    .populate('schoolId') 
    .populate('classId')  // It's usually helpful to see the class too
    .sort({ createdAt: -1 })
    .exec();

  console.log(`📊 Found ${students.length} students for school ID: ${schoolId}`);
  
  return students;
}

  // ❌ Delete student
  async deleteStudent(id: string) {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id);
    if (!deletedStudent) throw new NotFoundException('Student not found');
    return { message: 'Student deleted successfully' };
  }
}