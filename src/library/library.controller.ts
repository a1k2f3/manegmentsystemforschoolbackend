import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LibraryService } from './library.service';
import { CreateBookDto } from './create-book.dto';
import { UpdateBookDto } from './update-book.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('/books/create')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/books', // Ensure this folder exists
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return cb(new BadRequestException('Only PDF files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  create(@Body() createBookDto: CreateBookDto, @UploadedFile() file: Express.Multer.File) {
    return this.libraryService.create(createBookDto, file?.path);
  }

  @Get('/books')
  findAll() {
    return this.libraryService.findAll();
  }

  @Get('/books/:id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOne(id);
  }

  @Patch('/books/:id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.libraryService.update(id, updateBookDto);
  }

  @Delete('/books/:id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(id);
  }
}