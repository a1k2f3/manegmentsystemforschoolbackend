import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AssignTeacherToCourseDto } from './dto/assign-teacher-to-course.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  private validateObjectId(id: string, field = 'ID') {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${field}`);
    }
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    const existing = await this.courseModel.findOne({
      school: dto.school,
      academicYear: dto.academicYear,
      subject: dto.subject,
      code: dto.code,
    });
    if (existing) throw new ConflictException('This course offering already exists');

    const course = new this.courseModel({
      ...dto,
      teachers: dto.teachers || [],
      classes: dto.classes || [],
      students: [],
    });
    return course.save();
  }

  async findAll(
    schoolId?: string,
    academicYear?: string,
    subjectId?: string,
    departmentId?: string,
  ): Promise<Course[]> {
    const filter: any = { isActive: true };
    if (schoolId) filter.school = new Types.ObjectId(schoolId);
    if (academicYear) filter.academicYear = academicYear;
    if (subjectId) filter.subject = new Types.ObjectId(subjectId);
    if (departmentId) filter.department = new Types.ObjectId(departmentId);

    return this.courseModel
      .find(filter)
      .populate('school', 'name')
      .populate('subject', 'name code')
      .populate('department', 'name')
      .populate('teachers', 'fullName email')
      .populate('students', 'fullName rollNumber')
      .populate('classes', 'name section')
      .exec();
  }

  async findOne(id: string): Promise<Course> {
    this.validateObjectId(id);
    const course = await this.courseModel
      .findById(id)
      .populate(['school', 'subject', 'department', 'teachers', 'students', 'classes'])
      .exec();
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    this.validateObjectId(id);
    const updated = await this.courseModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!updated) throw new NotFoundException('Course not found');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    this.validateObjectId(id);
    const course = await this.courseModel.findByIdAndUpdate(
      id,
      { isActive: false, deactivatedAt: new Date() },
      { new: true },
    );
    if (!course) throw new NotFoundException('Course not found');
    return { message: 'Course deactivated successfully' };
  }

  async addTeacher(courseId: string, dto: AssignTeacherToCourseDto): Promise<Course> {
    this.validateObjectId(courseId);
    this.validateObjectId(dto.teacher);

    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const teacherId = new Types.ObjectId(dto.teacher);
    if (!course.teachers.some(t => t.equals(teacherId))) {
      course.teachers.push(teacherId);
      await course.save();
    }
    return this.findOne(courseId);
  }

  async removeTeacher(courseId: string, teacherId: string): Promise<Course> {
    this.validateObjectId(courseId);
    this.validateObjectId(teacherId);

    const updated = await this.courseModel.findByIdAndUpdate(
      courseId,
      { $pull: { teachers: new Types.ObjectId(teacherId) } },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Course not found');
    return this.findOne(courseId);
  }

  async enrollStudent(courseId: string, dto: EnrollStudentDto): Promise<Course> {
    this.validateObjectId(courseId);
    this.validateObjectId(dto.student);

    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (course.students.length >= course.maxCapacity) {
      throw new BadRequestException('Course capacity reached');
    }

    const studentId = new Types.ObjectId(dto.student);
    if (!course.students.some(s => s.equals(studentId))) {
      course.students.push(studentId);
      await course.save();
    }
    return this.findOne(courseId);
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<Course> {
    this.validateObjectId(courseId);
    this.validateObjectId(studentId);

    const updated = await this.courseModel.findByIdAndUpdate(
      courseId,
      { $pull: { students: new Types.ObjectId(studentId) } },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Course not found');
    return this.findOne(courseId);
  }
}