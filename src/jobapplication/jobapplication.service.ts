import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobApplication } from './jobapplication.schema';
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

  // ✅ Get a single job application by ID
  async findOne(id: string): Promise<JobApplication> {
    const jobApplication = await this.jobAppModel.findById(id).exec();
    if (!jobApplication) {
      throw new NotFoundException(`Job application with ID ${id} not found`);
    }
    return jobApplication;
  }
}
