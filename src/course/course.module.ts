import { Module } from '@nestjs/common';
import { CoursesController } from './course.controller';
import { CoursesService } from './course.service';
import { Course, CourseSchema } from './course.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CourseModule {}
