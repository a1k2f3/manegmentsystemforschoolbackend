import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Video extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Playlist', required: true })
  playlistId: Types.ObjectId;

  @Prop({ default: 'active' })
  status: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
