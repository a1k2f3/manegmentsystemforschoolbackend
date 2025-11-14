import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class, ClassDocument } from './schemas/class.schemas';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { School, SchoolDocument } from 'src/school/schema/school.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>, // used to validate schoolId
  ) {}

  // Create a class — validates schoolId exists
  async create(createDto: CreateClassDto): Promise<Class> {
    const { schoolId } = createDto;
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new BadRequestException('Invalid schoolId');
    }

    const schoolExists = await this.schoolModel.findById(schoolId).lean();
    if (!schoolExists) throw new BadRequestException('schoolId does not exist');

    // ensure className uniqueness in same school (optional)
    const exists = await this.classModel.findOne({
      schoolId,
      className: createDto.className,
      section: createDto.section ?? null,
    });

    if (exists) {
      throw new BadRequestException('Class with same name/section already exists in this school');
    }

    const created = new this.classModel({
      ...createDto,
      schoolId: new Types.ObjectId(schoolId),
      strength: 0,
      status: createDto.status ?? 'active',
    });

    return created.save();
  }
async addStudentToClass(classId: string, studentId: string) {
  if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(studentId)) {
    throw new BadRequestException('Invalid classId or studentId');
  }

  const klass = await this.classModel.findById(classId);
  if (!klass) throw new NotFoundException('Class not found');

  // prevent duplicate student entry
  if (klass.studentIds.includes(studentId as any)) {
    throw new BadRequestException('Student already in this class');
  }

  klass.studentIds.push(new Types.ObjectId(studentId));
  klass.strength = klass.studentIds.length;

  return klass.save();
}
async removeStudentFromClass(classId: string, studentId: string) {
  if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(studentId)) {
    throw new BadRequestException('Invalid classId or studentId');
  }

  const klass = await this.classModel.findById(classId);
  if (!klass) throw new NotFoundException('Class not found');

  klass.studentIds = klass.studentIds.filter(
    id => id.toString() !== studentId,
  );

  klass.strength = klass.studentIds.length;

  return klass.save();
}
  // Get all classes
  async findAll(): Promise<Class[]> {
    return this.classModel.find().sort({ createdAt: -1 }).lean();
  }

  // Get classes for a specific school
  async findBySchool(schoolId: string): Promise<Class[]> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new BadRequestException('Invalid schoolId');
    }
    return this.classModel.find({ schoolId }).sort({ className: 1 }).lean();
  }

  // Get one class by id
  async findOne(id: string): Promise<Class> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class id');
    const klass = await this.classModel.findById(id).lean();
    if (!klass) throw new NotFoundException('Class not found');
    return klass as Class;
  }

  // Update class
  async update(id: string, updateDto: UpdateClassDto): Promise<Class> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class id');

    if (updateDto.schoolId && !Types.ObjectId.isValid(updateDto.schoolId)) {
      throw new BadRequestException('Invalid schoolId');
    }
    if (updateDto.schoolId) {
      const schoolExists = await this.schoolModel.findById(updateDto.schoolId).lean();
      if (!schoolExists) throw new BadRequestException('schoolId does not exist');
    }

    const updated = await this.classModel.findByIdAndUpdate(
      id,
      { $set: updateDto },
      { new: true },
    ).exec();

    if (!updated) throw new NotFoundException('Class not found');
    return updated;
  }
async assignClassJobApplication(classId: string, jobAppId: string) {
  if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(jobAppId)) {
    throw new BadRequestException('Invalid classId or jobApplicationId');
  }

  const updated = await this.classModel.findByIdAndUpdate(
    classId,
    { jobApplicationId: jobAppId },
    { new: true },
  );

  if (!updated) throw new NotFoundException('Class not found');
  return updated;
}
  // Delete class (hard delete). You may prefer soft delete by setting status.
  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid class id');
    const deleted = await this.classModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Class not found');
    return { message: 'Class deleted successfully' };
  }
}
