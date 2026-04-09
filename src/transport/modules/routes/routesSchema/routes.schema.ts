import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route {

  @Prop({ required: true })
  routeName?: string; // R-01 Dwarka

  @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
  vehicle?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Driver' })
  driver?: Types.ObjectId;

  @Prop()
  capacity?: number;

  @Prop()
  fee?: number;

  @Prop({ default: true })
  isActive?: boolean;
}

export const RouteSchema = SchemaFactory.createForClass(Route);