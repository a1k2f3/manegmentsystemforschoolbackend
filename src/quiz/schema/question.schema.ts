import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false }) // embedded → no separate _id
export class QuestionOption {
  @Prop({ required: true })
  text?: string;

  @Prop({ default: false })
  isCorrect?: boolean; // optional - if you prefer marking correct in options
}

export const QuestionOptionSchema = SchemaFactory.createForClass(QuestionOption);

@Schema({ _id: false })
export class Question {
  @Prop({ required: true, trim: true })
  text?: string;

  @Prop({ type: [QuestionOptionSchema], minlength: 2, maxlength: 6 })
  options?: QuestionOption[];

  // ── Alternative A: store correct as index (most common & efficient) ──
  @Prop({ type: Number, min: 0 })
  correctOptionIndex?: number;

  // ── Alternative B: store correct answer text (more readable but less performant)
  // @Prop({ trim: true })
  // correctAnswerText?: string;

  @Prop({ default: 1 })
  marks?: number;

  @Prop({ trim: true })
  explanation?: string; // shown after answering
}

export const QuestionSchema = SchemaFactory.createForClass(Question);