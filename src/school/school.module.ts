import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schema/school.schema';

@Module({imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]), // ✅ This is essential
  ],
  providers: [SchoolService],
  controllers: [SchoolController]
})
export class SchoolModule {}
