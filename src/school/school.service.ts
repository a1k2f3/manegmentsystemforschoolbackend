import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School} from './schema/school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class SchoolService {
   @InjectModel(School.name)
  private schoolModel!: Model<School>;
  private readonly jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

async create(createSchoolDto: CreateSchoolDto): Promise<School> {
  // Clean all string fields - remove extra quotes and trim whitespace
  const fieldsToClean = [
    'schoolName', 'principalName', 'principalEmail', 'contactPhone',
    'password', 'website', 'registrationNumber', 'addressLine1',
    'addressLine2', 'city', 'state', 'postcode', 'affiliationBoard',
    'accreditationNumber'
  ];

  fieldsToClean.forEach(field => {
    if (typeof createSchoolDto[field as keyof CreateSchoolDto] === 'string') {
      let value = createSchoolDto[field as keyof CreateSchoolDto] as string;
      
      // Remove all double quotes
      value = value.replace(/"/g, '');
      // Trim whitespace
      value = value.trim();

      (createSchoolDto as any)[field] = value;
    }
  });

  // Special handling for schoolType (remove quotes too)
  if (typeof createSchoolDto.schoolType === 'string') {
    createSchoolDto.schoolType = createSchoolDto.schoolType.replace(/"/g, '').trim();
  }

  // Generate emailDomain from principalEmail
  if (createSchoolDto.principalEmail) {
    const domain = createSchoolDto.principalEmail.split('@')[1]?.trim().toLowerCase();
    if (domain) {
      createSchoolDto.emailDomain = domain;
    }
  }

  const school = new this.schoolModel(createSchoolDto);
  return school.save();
}

  async findAll(): Promise<School[]> {
    return this.schoolModel.find().exec();
  }
async login(email: string, password: string) {
  console.log('🔍 Login attempt with email:', email);

  // Clean the input email (remove spaces, quotes, convert to lowercase)
  const cleanEmail = email?.trim().replace(/"/g, '').toLowerCase();

  console.log('🔍 Cleaned email for search:', cleanEmail);

  // Find school by principalEmail
  const school = await this.schoolModel.findOne({ 
    principalEmail: cleanEmail 
  }).lean();

  console.log('📊 Found school:', school);

  if (!school) {
    // Show all schools for debugging
    const allSchools = await this.schoolModel.find({}, { 
      principalEmail: 1, 
      schoolName: 1 
    }).lean();
    
    console.log('📋 All schools in DB:', allSchools);
    
    throw new NotFoundException(`School not found with email: ${cleanEmail}`);
  }

  console.log('✅ School found:', school.principalEmail);

  // Direct password comparison (NO bcrypt) - as you requested
  if (school.password !== password) {
    console.log('❌ Invalid password for email:', cleanEmail);
    throw new UnauthorizedException('Invalid password');
  }

  // Generate JWT token
  const token = await this.jwtService.signAsync({
    sub: school._id,
    id: school._id,
    email: school.principalEmail,
    name: school.schoolName,
  });

  return {
    message: 'Login successful',
    token,
    school: {
      id: school._id,
      schoolName: school.schoolName,
      principalName: school.principalName,
      principalEmail: school.principalEmail,
      status: school.status,
      token
    },
  };
}
  async findOne(id: string): Promise<School> {
    const school = await this.schoolModel.findById(id).exec();
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const updated = await this.schoolModel.findByIdAndUpdate(id, updateSchoolDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('School not found');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.schoolModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('School not found');
    return { message: 'School deleted successfully' };
  }
}
