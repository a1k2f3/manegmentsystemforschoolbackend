import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student, StudentSchema } from './schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    JwtModule.register({
      secret: 'school_secret_key', // ⚠️ Move this to ENV in production
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
