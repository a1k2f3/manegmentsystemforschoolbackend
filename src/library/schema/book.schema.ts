import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class Book {
  // id is handled by MongoDB as _id. 
  // If you want a numeric ID, you'd use the mongoose-sequence plugin.

  @Prop({ required: true, trim: true })
  name?: string;

  @Prop({ required: true, trim: true })
  author?: string;

  @Prop({ required: true, trim: true })
  category?: string;

  @Prop({ trim: true })
  publisher?: string;

  @Prop({ min: 1 })
  pages?: number;

  @Prop({ required: true, min: 0 })
  price?: number;

  @Prop({ min: 1000, max: new Date().getFullYear() })
  year?: number;
  @Prop()
pdfPath?: string; // To store the location of the uploaded file
}

export const BookSchema = SchemaFactory.createForClass(Book);