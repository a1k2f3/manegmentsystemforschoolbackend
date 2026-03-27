// src/departments/department.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,   // ← optional – if you want controller-level error
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { AssignHodDto } from './dto/assign-hod.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  findAll(@Query('schoolId') schoolId?: string) {
    return this.departmentService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }

  // ── Extra useful routes ─────────────────────────────────────────────

  @Patch(':id/assign-hod')
  assignHod(
    @Param('id') id: string,
    @Body() assignHodDto: AssignHodDto,
  ) {
    return this.departmentService.assignHod(id, assignHodDto);
  }

  @Patch(':id/teachers/:teacherId')
  addTeacher(
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.departmentService.addTeacher(id, teacherId);
  }

  @Delete(':id/teachers/:teacherId')
  removeTeacher(
    @Param('id') id: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.departmentService.removeTeacher(id, teacherId);
  }
}