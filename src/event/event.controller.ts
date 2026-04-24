import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { BookEventDto } from './dto/book-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Post('create')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }
  @Get('getAll')
  findAll(@Query('schoolId') schoolId?: string) {
    return this.eventsService.findAll(schoolId);
  }
  @Post(':id/book')
  book(@Param('id') id: string, @Body() bookEventDto: BookEventDto) {
    if (!bookEventDto.studentId) {
      throw new BadRequestException('studentId is required');
    }
    return this.eventsService.bookEvent(id, bookEventDto.studentId);
  }
  @Get(':id/bookings')
  getBookings(@Param('id') id: string) {
    return this.eventsService.getBookingsForEvent(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}