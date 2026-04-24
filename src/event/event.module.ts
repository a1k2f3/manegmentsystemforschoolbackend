import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { EventSchema } from './schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule {}
