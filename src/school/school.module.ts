import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schema/school.schema';
import { JwtModule } from '@nestjs/jwt';
@Module({imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]), // ✅ This is essential
     JwtModule.register({
          secret: 'school_secret_key', // ⚠️ Move this to ENV in production
          signOptions: { expiresIn: '7d' },
        }),
  ],
  providers: [SchoolService],
  controllers: [SchoolController]
})
export class SchoolModule {}
