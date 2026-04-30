import { BadRequestException, Body, Controller, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AsgimentService } from "./asgiment.service";
import { CreateAssignmentDto } from "./dto/create-assignment.dto";
import { SubmitAssignmentDto } from "./dto/submit-assignment.dto";
import { MarkSubmissionDto } from "./dto/mark-submission.dto";
// import { AsgimentService } from "./asgiment.service";

@Controller('asgiment')
export class AsgimentController {
  constructor(private readonly assignmentService: AsgimentService) {}

  // TEACHER: Add Assignment
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
   @Body() createDto: CreateAssignmentDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.assignmentService.createAssignment(createDto, file?.path);
  }

  // STUDENT: Submit Assignment
  @Post('submit')
  @UseInterceptors(FileInterceptor('file'))
  async submit(
    @Body() submitDto: SubmitAssignmentDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.assignmentService.submitAssignment(submitDto, file?.path);
  }

  // TEACHER: Mark Submission
 @Patch('mark/:submissionId')
async mark(
  @Param('submissionId') id: string,
  @Body() markDto: MarkSubmissionDto // Use the DTO here directly
) {
  // Pass the ID and the whole DTO object (2 arguments)
  return this.assignmentService.markSubmission(id, markDto);
}
}