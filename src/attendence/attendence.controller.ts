// src/attendance/attendance.controller.ts
import { Controller, Post, Body, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AttendanceService } from './attendence.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateBulkAttendanceDto } from './dto/create-bulk-attendance.dto';
// import { CreateBulkAttendanceDto } from './dto/create-bulk-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Mark attendance (manual or QR scan)
  @Post('mark')
  async mark(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.markAttendance(dto);
  }
@Get('generate-qr/:classId/:schoolId')
async generateQr(
  @Param('classId') classId: string,
  @Param('schoolId') schoolId: string,
) {
  return this.attendanceService.generateQrCode(classId, schoolId);
}
// 🎯 Mark attendance using QR code (mobile scan)
@Post('scan')
async scanAttendance(
  @Body('studentId') studentId: string,
  @Body('qrData') qrData: any,
) {
  return this.attendanceService.markViaQr(studentId, qrData);
}
@Post('bulk/mark')
  @HttpCode(HttpStatus.CREATED)
  async createBulk(@Body() createBulkDto: CreateBulkAttendanceDto) {
    const result = await this.attendanceService.createBulk(createBulkDto);
    return {
      message: 'Bulk attendance recorded successfully',
      count: result.length,
      data: result,
    };
  }
  // Class-wise
  @Get('class/:classId')
  async classAttendance(
    @Param('classId') classId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.attendanceService.getByClass(classId, month, year);
  }

  // School-wise
  @Get('school/:schoolId')
  async schoolAttendance(
    @Param('schoolId') schoolId: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.attendanceService.getBySchool(schoolId, month, year);
  }

  // Monthly report
  @Get('class/:classId/report')
  async monthlyReport(
    @Param('classId') classId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.attendanceService.monthlyReport(classId, month, year);
  }

  // Attendance analytics
  @Get('class/:classId/analytics')
  async analytics(
    @Param('classId') classId: string,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.attendanceService.getAttendancePercentage(classId, month, year);
  }
}
