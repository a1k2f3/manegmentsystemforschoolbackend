import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  name?: string;

  @Prop({ required: true })
  type?: string;

  @Prop({ required: true })
  date?: Date;

  @Prop({ required: true })
  time?: string;

  @Prop({ required: true })
  venue?: string;

  @Prop({ required: true })
  chiefGuest?: string;

  @Prop({ required: true, min: 0 })
  totalSlots?: number;

  @Prop({ required: true, min: 0 })
  availableSlots?: number;

  @Prop({ 
    type: Types.ObjectId, 
    ref: 'School',           // ← Foreign Key to School collection
    required: true,
    index: true 
  })
  schoolId?: Types.ObjectId;   // Now it's ObjectId reference

  @Prop({ default: 'upcoming' })
  status?: string;

  @Prop()
  description?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);