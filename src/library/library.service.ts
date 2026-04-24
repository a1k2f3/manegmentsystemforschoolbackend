import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { CreateBookDto } from './create-book.dto';
import { UpdateBookDto } from './update-book.dto';

@Injectable()
export class LibraryService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  // CREATE
  async create(createBookDto: CreateBookDto, filePath?: string) {
    const newBook = new this.bookModel({
      ...createBookDto,
      pdfPath: filePath || null,
    });
    return await newBook.save();
  }

  // GET ALL
  async findAll() {
    return await this.bookModel.find().sort({ createdAt: -1 }).exec();
  }

  // GET ONE
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  // UPDATE
  async update(id: string, updateBookDto: UpdateBookDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
    if (!updatedBook) throw new NotFoundException('Book not found');
    return updatedBook;
  }

  // DELETE
  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const deleted = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Book not found');
    return { message: 'Book deleted successfully' };
  }
}