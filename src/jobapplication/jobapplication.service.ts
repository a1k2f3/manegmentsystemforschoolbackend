import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobApplication } from './schemas/jobapplication.schema';
import { CreateJobApplicationDto } from './dto/jobapplication.dto';
import { School } from '../school/schema/school.schema';
// import { Types } from 'mongoose';
@Injectable()
export class JobApplicationService {
constructor(
  @InjectModel(JobApplication.name)
  private readonly jobAppModel: Model<JobApplication>,

  @InjectModel(School.name)
  private readonly schoolModel: Model<School>, // ✅ add this
) {}
  // ✅ Create new job application
async create(createJobApplicationDto: CreateJobApplicationDto) {
  const { schoolId } = createJobApplicationDto;
  console.log('Received schoolId:', schoolId);
  if (!schoolId || !Types.ObjectId.isValid(schoolId)) {
    throw new BadRequestException('Invalid or missing schoolId');
  }
  // Check if school exists
  const schoolExists = await this.schoolModel.findById(schoolId);
  if (!schoolExists) {
    throw new BadRequestException('School not found');
  }
  const applicationData = {
    ...createJobApplicationDto,
    schoolId: new Types.ObjectId(schoolId),
  };

  const savedApp = await this.jobAppModel.create(applicationData);

  await this.schoolModel.findByIdAndUpdate(
    schoolId,
    { $addToSet: { jobApplications: savedApp._id } }
  );

  return savedApp;
}
  // ✅ Get all job applications
  async findAll(): Promise<JobApplication[]> {
    return this.jobAppModel.find().sort({ createdAt: -1 }).exec();
  }
  // jobapplication.service.ts

async updateStatus(id: string, status: string): Promise<JobApplication> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid application ID');
  }

  const updated = await this.jobAppModel.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  if (!updated) {
    throw new NotFoundException(`Application with ID ${id} not found`);
  }

  return updated;
}
async getteacherBySchool(schoolId: string) {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new BadRequestException('Invalid school ID');
  }

  return this.jobAppModel
    .find({ schoolId: new Types.ObjectId(schoolId) })
    .populate('schoolId')
    .sort({ createdAt: -1 })
    .exec();
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
