import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { Assignment } from "./schemas/assignment.schema";
import { Submission } from "./schemas/submission.schema";
import { InjectModel } from "@nestjs/mongoose";
// Import your DTOs
import { CreateAssignmentDto } from "./dto/create-assignment.dto";
import { SubmitAssignmentDto } from "./dto/submit-assignment.dto";
import { MarkSubmissionDto } from "./dto/mark-submission.dto";

@Injectable()
export class AsgimentService {
  constructor(
    @InjectModel(Assignment.name) private assignmentModel: Model<Assignment>,
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  // 1. Teacher creates assignment using CreateAssignmentDto
  async createAssignment(createDto: CreateAssignmentDto, filePath?: string) {
    const newAssignment = new this.assignmentModel({
      ...createDto,
      fileUrl: filePath || null,
    });
    return newAssignment.save();
  }

  // 2. Student submits using SubmitAssignmentDto
  async submitAssignment(submitDto: SubmitAssignmentDto, filePath: string) {
    const { assignmentId, studentId } = submitDto;
    
    const assignment = await this.assignmentModel.findById(assignmentId);
    
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // DEADLINE VALIDATION
    const now = new Date();
    if (!assignment.deadline) {
      throw new BadRequestException('Assignment deadline is not set');
    }
    const deadline = new Date(assignment.deadline);
    if (isNaN(deadline.getTime())) {
      throw new BadRequestException('Assignment deadline is invalid');
    }

    if (now > deadline) {
      throw new BadRequestException('The deadline for this assignment has passed');
    }

    const submission = new this.submissionModel({
      assignmentId,
      studentId,
      fileUrl: filePath,
    });
    
    return submission.save();
  }

  // 3. Teacher marks assignment using MarkSubmissionDto
  async markSubmission(submissionId: string, markDto: MarkSubmissionDto) {
    const updatedSubmission = await this.submissionModel.findByIdAndUpdate(
      submissionId,
      { 
        obtainedMarks: markDto.obtainedMarks, 
        teacherFeedback: markDto.teacherFeedback, 
        status: 'marked' 
      },
      { new: true }
    );

    if (!updatedSubmission) {
      throw new NotFoundException('Submission not found');
    }

    return updatedSubmission;
  }
}