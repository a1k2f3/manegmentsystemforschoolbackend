import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Department } from './entities/department.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AssignHodDto } from './dto/assign-hod.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = new this.departmentModel(createDepartmentDto);
    return department.save();
  }

  async findAll(schoolId?: string): Promise<Department[]> {
    const filter = schoolId ? { school: new Types.ObjectId(schoolId), isActive: true } : { isActive: true };
    return this.departmentModel
      .find(filter)
      .populate('school', 'name')
      .populate('hod', 'fullName email')
      .populate('teachers', 'fullName email')
      .exec();
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel
      .findById(id)
      .populate('school', 'name')
      .populate('hod', 'fullName email')
      .populate('teachers', 'fullName email')
      .exec();

    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    const updated = await this.departmentModel
      .findByIdAndUpdate(id, updateDepartmentDto, { new: true, runValidators: true })
      .exec();

    if (!updated) throw new NotFoundException('Department not found');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const department = await this.departmentModel.findByIdAndUpdate(
      id,
      { isActive: false, deactivatedAt: new Date() },
      { new: true },
    );

    if (!department) throw new NotFoundException('Department not found');
    return { message: 'Department deactivated successfully' };
  }

  // ── Additional useful endpoints ─────────────────────────────────────

  async assignHod(departmentId: string, assignHodDto: AssignHodDto): Promise<Department> {
    const department = await this.departmentModel.findById(departmentId);
    if (!department) throw new NotFoundException('Department not found');

    // You might want to check if teacher belongs to this department/school
    department.hod = new Types.ObjectId(assignHodDto.hod);
    return department.save();
  }

  async addTeacher(departmentId: string, teacherId: string): Promise<Department> {
    const department = await this.departmentModel.findById(departmentId);
    if (!department) throw new NotFoundException('Department not found');

    if (!department.teachers) department.teachers = [];
    if (!department.teachers.includes(new Types.ObjectId(teacherId))) {
      department.teachers.push(new Types.ObjectId(teacherId));
      await department.save();
    }

    return this.findOne(departmentId); // return populated
  }

  async removeTeacher(departmentId: string, teacherId: string): Promise<Department> {
    const result = await this.departmentModel.findByIdAndUpdate(
      departmentId,
      { $pull: { teachers: new Types.ObjectId(teacherId) } },
      { new: true },
    );

    if (!result) throw new NotFoundException('Department not found');
    return this.findOne(departmentId);
  }
}