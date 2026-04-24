import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ 
    type: Types.ObjectId, 
    ref: 'Event', 
    required: true 
  })
  event?: Types.ObjectId;

  @Prop({ required: true })
  studentId?: string;

  @Prop({ required: true, unique: true })
  ticketNumber?: string;

  @Prop({ default: 'confirmed' })
  status?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);