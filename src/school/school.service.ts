import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School, SchoolDocument } from './schema/school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class SchoolService {
   @InjectModel(School.name) private schoolModel: Model<SchoolDocument>
  private readonly jwtService: JwtService;

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = new this.schoolModel(createSchoolDto);
    return school.save();
  }

  async findAll(): Promise<School[]> {
    return this.schoolModel.find().exec();
  }
async login(email: string, password: string) {
    const school = await this.schoolModel.findOne({ email });
    if (!school) throw new NotFoundException('Student not found');

    const isPasswordValid = await bcrypt.compare(password, school.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    // Generate JWT token
    const token = await this.jwtService.signAsync({
      id: school._id,
      email: school.principalEmail,
      name: school.schoolName,
    });

    return {
      message: 'Login successful',
      token,
      student: {
        id: school._id,
        email: school.principalEmail,
      name: school.schoolName,
        status:school.status,
        schoolId: school._id, // include school reference
      },
    };
  }
  async findOne(id: string): Promise<School> {
    const school = await this.schoolModel.findById(id).exec();
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const updated = await this.schoolModel.findByIdAndUpdate(id, updateSchoolDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('School not found');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.schoolModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('School not found');
    return { message: 'School deleted successfully' };
  }
}
