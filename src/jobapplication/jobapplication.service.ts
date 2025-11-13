import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobApplication } from './schemas/jobapplication.schema';
import { CreateJobApplicationDto } from './dto/jobapplication.dto';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(JobApplication.name)
    private readonly jobAppModel: Model<JobApplication>,
  ) {} 
  // ✅ Create new job application
  async create(
    createJobApplicationDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    const createdApplication = new this.jobAppModel(createJobApplicationDto);
    return createdApplication.save();
  }
  // ✅ Get all job applications
  async findAll(): Promise<JobApplication[]> {
    return this.jobAppModel.find().sort({ createdAt: -1 }).exec();
  }
async getteacherBySchool(schoolId: string) {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new BadRequestException('Invalid school ID');
  }
  const apllication = await this.jobAppModel
    .find({ schoolId })
    .populate('schoolId') 
    .sort({ createdAt: -1 });
  return apllication;
}
  // ✅ Get a single job application by ID
  async findOne(id: string): Promise<JobApplication> {
    const jobApplication = await this.jobAppModel.findById(id).exec();
    if (!jobApplication) {
      throw new NotFoundException(`Job application with ID ${id} not found`);
    }
    return jobApplication;
  }
}
