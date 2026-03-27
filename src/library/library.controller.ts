import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateBookDto } from './create-book.dto';
import { UpdateBookDto } from './update-book.dto';

@Controller('library')
export class LibraryController {

  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.libraryService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.libraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.libraryService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(+id);
  }
}