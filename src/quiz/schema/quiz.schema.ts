import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Question, QuestionSchema } from './question.schema';

export type QuizDocument = Quiz & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false },
})
export class Quiz {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 150 })
  title?: string;

  @Prop({ trim: true })
  description?: string;

  // Reference to Course (most important relation)
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
  course?: Types.ObjectId;

  // Optional: direct class/grade reference (e.g. "Class 8", "Grade 10")
  // Useful if quizzes are sometimes class-specific rather than course-specific
  @Prop({ trim: true })
  classOrGrade?: string; // "Class 7", "Grade 10 - Science", "Matric Part 1"

  // Questions embedded (most common for quizzes < 100 questions)
  @Prop({ type: [QuestionSchema], default: [] })
  questions?: Question[];

  @Prop({ default: 0 })
  totalMarks?: number; // can be auto-calculated in pre-save hook

  @Prop({ default: 30 })
  timeLimitMinutes?: number;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ enum: ['Draft', 'Published', 'Archived'], default: 'Draft' })
  status?: string;

  @Prop({ default: 1 })
  maxAttempts?: number; // per student

  @Prop()
  passingPercentage?: number; // e.g. 50

  // Who created / last modified (useful for schools)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  // Optional: scheduled date, expiry, etc.
  @Prop()
  availableFrom?: Date;

  @Prop()
  availableUntil?: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

// Optional: auto-calculate total marks before save
QuizSchema.pre('save', function (next) {
  const questions = this.questions ?? [];

  if (questions.length > 0) {
    this.totalMarks = questions.reduce((sum, q) => sum + (q.marks ?? 1), 0);
  } else {
    this.totalMarks = 0;
  }

  next();
});

// Indexes for performance
QuizSchema.index({ course: 1, status: 1 });
QuizSchema.index({ title: 'text', description: 'text' });