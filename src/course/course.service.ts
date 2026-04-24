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

async findAll(schoolId?: string, academicYear?: string): Promise<Course[]> {
    const filter: any = { isActive: { $ne: false } };

    if (schoolId) {
      const cleanId = schoolId.trim();
      if (!Types.ObjectId.isValid(cleanId)) {
        throw new BadRequestException('Invalid school ID format');
      }

      /** * FIX: We use $in to match both the ObjectId version AND the String version.
       * This fixes your current "0 matches" issue because your DB has a string 
       * but your filter was using an ObjectId.
       */
      filter.school = { 
        $in: [cleanId, new Types.ObjectId(cleanId)] 
      };
    }

    if (academicYear) {
      filter.academicYear = academicYear.trim();
    }

    // console.log('Final Filter:', JSON.stringify(filter, null, 2));

    return this.courseModel
      .find(filter)
      .populate('school', 'name')
      .populate('teachers', 'fullName email')
      .populate('students', 'fullName rollNumber')
      .populate('classes', 'name section')
      .exec();
  }
  async findOne(id: string): Promise<Course> {
    this.validateObjectId(id);
    const course = await this.courseModel
      .findById(id)
      .populate(['school', 'teachers', 'students', 'classes'])
      .exec();
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
async findAllByTeacher(
  teacherId: string,
  academicYear?: string,
): Promise<Course[]> {
  // 1. Initial filter for active courses
  const filter: any = { isActive: { $ne: false } };

  // 2. Validate and handle teacherId
  if (!teacherId) {
    throw new BadRequestException('Teacher ID is required');
  }

  const cleanTeacherId = teacherId.trim();
  if (!Types.ObjectId.isValid(cleanTeacherId)) {
    throw new BadRequestException('Invalid teacher ID format');
  }

  /**
   * Since 'teachers' is an array in your Schema, MongoDB will look
   * for the ID inside that array. Using $in here handles both 
   * String and ObjectId types for legacy/mismatched data.
   */
  filter.teachers = { 
    $in: [cleanTeacherId, new Types.ObjectId(cleanTeacherId)] 
  };

  // 3. Optional Academic Year filter
  if (academicYear) {
    filter.academicYear = academicYear.trim();
  }

  console.log('--- Teacher Course Query Debug ---');
  console.log('Filter:', JSON.stringify(filter, null, 2));

  return this.courseModel
    .find(filter)
    .populate('school', 'name')
    .populate('teachers', 'fullName email')
    .populate('students', 'fullName rollNumber')
    .populate('classes', 'name section')
    .exec();
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
     if (!dto.teacher) {
    throw new BadRequestException('Teacher ID is required');
  }
  this.validateObjectId(dto.teacher);


    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const teacherId = new Types.ObjectId(dto.teacher);
    
    // Use optional chaining and default empty array to prevent 'possibly undefined' error
    if (!(course.teachers || []).some(t => t.equals(teacherId))) {
      if (!course.teachers) course.teachers = [];
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
    if (!dto.student) {
      throw new BadRequestException('Student ID is required');
    }
    this.validateObjectId(dto.student);

    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    // Added safety checks for students array and maxCapacity value
    const studentCount = course.students?.length || 0;
    const capacity = course.maxCapacity || Infinity;

    if (studentCount >= capacity) {
      throw new BadRequestException('Course capacity reached');
    }

    const studentId = new Types.ObjectId(dto.student);
    if (!(course.students || []).some(s => s.equals(studentId))) {
      if (!course.students) course.students = [];
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