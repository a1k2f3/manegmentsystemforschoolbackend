import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    if (!createEventDto.date) {
      throw new BadRequestException('Date is required');
    }
    const eventData = {
      ...createEventDto,
      schoolId: new Types.ObjectId(createEventDto.schoolId),   // Convert string to ObjectId
      date: new Date(createEventDto.date),
      availableSlots: createEventDto.totalSlots,
    };

    const createdEvent = new this.eventModel(eventData);
    return createdEvent.save();
  }

  // Get events by schoolId (now ObjectId)
  async findAll(schoolId?: string): Promise<Event[]> {
    const filter = schoolId ? { schoolId: new Types.ObjectId(schoolId) } : {};
    return this.eventModel
      .find(filter)
      .populate('schoolId', 'name code')   // Optional: populate school details
      .sort({ date: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate('schoolId', 'name code')
      .exec();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    if (updateEventDto.schoolId) {
      updateEventDto.schoolId = new Types.ObjectId(updateEventDto.schoolId) as any;
    }

    const updated = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .populate('schoolId', 'name code')
      .exec();

    if (!updated) throw new NotFoundException('Event not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Event not found');
  }

  // ====================== STUDENT BOOKING ======================
  async bookEvent(eventId: string, studentId: string) {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException('Event not found');

    if (!event.availableSlots || event.availableSlots <= 0) {
      throw new BadRequestException('No slots available for this event');
    }

    if (event.status !== 'upcoming') {
      throw new BadRequestException('Event is not open for booking');
    }

    const ticketNumber = `TICK-${uuidv4().slice(0, 8).toUpperCase()}`;

    const booking = new this.bookingModel({
      event: new Types.ObjectId(eventId),
      studentId,
      ticketNumber,
    });
    await booking.save();

    const updatedEvent = await this.eventModel.findByIdAndUpdate(
      eventId,
      { $inc: { availableSlots: -1 } },
      { new: true },
    ).exec();

    return {
      message: 'Event booked successfully',
      ticketNumber,
      event: updatedEvent,
      booking,
    };
  }

  async getBookingsForEvent(eventId: string) {
    return this.bookingModel
      .find({ event: new Types.ObjectId(eventId) })
      .populate('event', 'name date time venue schoolId')
      .exec();
  }
}