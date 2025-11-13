import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Playlist extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  thumbnail: string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
