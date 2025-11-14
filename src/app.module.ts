import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { JobApplicationModule } from './jobapplication/jobapplication.module';
import { AdminModule } from './admin/admin.module';
import { SchoolModule } from './school/school.module';
import { ClassModule } from './class/class.module';
// import { PrincipleModule } from './principle/principle.module';
import { TimetableModule } from './timetable/timetable.module';
import { CourseModule } from './course/course.module';
import { AttendanceModule } from './attendence/attendence.module';
import { AsgimentModule } from './asgiment/asgiment.module';
import { DepartmentModule } from './department/department.module';
import { QuizModule } from './quiz/quiz.module';
import { VideoModule } from './video/video.module';
import { ResultModule } from './result/result.module';
import { TestsesionModule } from './testsesion/testsesion.module';
import { AcountsModule } from './acounts/acounts.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/erpdb'),  
    StudentModule, AdminModule, SchoolModule, ClassModule, TimetableModule, CourseModule,  AttendanceModule, AsgimentModule, DepartmentModule, QuizModule, VideoModule, ResultModule, TestsesionModule, AcountsModule, SuperadminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}