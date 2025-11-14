// src/attendance/attendance.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './schemas/attendance.schemas';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Class, ClassDocument } from 'src/class/schemas/class.schemas';
import { School, SchoolDocument } from 'src/school/schema/school.schema';
import { Student, StudentDocument } from 'src/student/schemas/student.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  // ✅ Mark attendance (QR code or manual)
  async markAttendance(dto: CreateAttendanceDto) {
    const { studentId, classId, schoolId, status } = dto;

    if (![studentId, classId, schoolId].every(id => Types.ObjectId.isValid(id))) {
      throw new BadRequestException('Invalid IDs provided');
    }

    const [student, klass, school] = await Promise.all([
      this.studentModel.findById(studentId),
      this.classModel.findById(classId),
      this.schoolModel.findById(schoolId),
    ]);

    if (!student) throw new NotFoundException('Student not found');
    if (!klass) throw new NotFoundException('Class not found');
    if (!school) throw new NotFoundException('School not found');

    // prevent duplicate for same day
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const exists = await this.attendanceModel.findOne({
      student: studentId,
      classId,
      schoolId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (exists) throw new BadRequestException('Attendance already marked today');

    const record = new this.attendanceModel({
      student: studentId,
      classId,
      schoolId,
      status,
      date: new Date(),
    });

    return record.save();
  }

  // ✅ Class-wise attendance
  async getByClass(classId: string, month?: number, year?: number) {
    const query: any = { classId };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    return this.attendanceModel.find(query).populate('student classId schoolId');
  }

  // ✅ School-wise attendance
  async getBySchool(schoolId: string, month?: number, year?: number) {
    const query: any = { schoolId };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }
    return this.attendanceModel.find(query).populate('student classId schoolId');
  }

  // ✅ Monthly report
  async monthlyReport(classId: string, month: number, year: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const records = await this.attendanceModel.find({
      classId,
      date: { $gte: start, $lte: end },
    }).populate('student');

    const report: Record<string, { present: number; absent: number; leave: number }> = {};
    records.forEach(r => {
      const studentName = r.student.name;
      if (!report[studentName]) report[studentName] = { present: 0, absent: 0, leave: 0 };
      report[studentName][r.status]++;
    });

    return report;
  }

  // ✅ Attendance percentage analytics
  async getAttendancePercentage(classId: string, month: number, year: number) {
    const report = await this.monthlyReport(classId, month, year);
    return Object.keys(report).map(student => {
      const total = report[student].present + report[student].absent + report[student].leave;
      const percentage = total ? (report[student].present / total) * 100 : 0;
      return { student, percentage };
    });
  }
}
