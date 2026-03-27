import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';
import { UpdateBookDto } from './update-book.dto';

@Injectable()
export class LibraryService {

  private libraries: any[] = [];
  private id = 1;

  // CREATE
  create(createLibraryDto: CreateBookDto) {
    const library = {
      id: this.id++,
      ...createLibraryDto,
    };

    this.libraries.push(library);
    return library;
  }

  // GET ALL
  findAll() {
    return this.libraries;
  }

  // GET ONE
  findOne(id: number) {
    const library = this.libraries.find(l => l.id === id);

    if (!library) {
      throw new NotFoundException('Library item not found');
    }

    return library;
  }

  // UPDATE
  update(id: number, updateLibraryDto: UpdateBookDto) {
    const library = this.findOne(id);

    Object.assign(library, updateLibraryDto);

    return library;
  }

  // DELETE
  remove(id: number) {
    const index = this.libraries.findIndex(l => l.id === id);

    if (index === -1) {
      throw new NotFoundException('Library item not found');
    }

    return this.libraries.splice(index, 1);
  }
}