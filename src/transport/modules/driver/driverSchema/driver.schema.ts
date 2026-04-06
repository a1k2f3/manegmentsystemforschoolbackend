import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document ,trusted,Types } from 'mongoose';


export type DriverDocument = Driver & Document;

@Schema({timestamps:true})

export class Driver{

    @Prop({required:true})

    driverName:string;

    @Prop({required:true})
    LicenseNumber:string;

    @Prop({required:true})
    mobileNumber:string;

    @Prop({ type: Types.ObjectId, ref: 'Route' })
    route: Types.ObjectId;

    @Prop({required:true})
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    }
    
    

}

export const DriverSchema = SchemaFactory.createForClass(Driver);
