import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {Document , Types} from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })

export class Vehicle {
  @Prop({ required: true })
  registrationNumber: string; // R-01 Dwarka

  @Prop({ required: true })
  vehicleType: string;

  @Prop({ required: true })
  insuranceexpiryDate: Date;

  @Prop({default: true})
  pullutioncertificate: boolean;

}  
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
    
