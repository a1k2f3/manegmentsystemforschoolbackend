import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schema/book.schema';
// import { Book } from './schema/book.entity';
import { BookingSchema } from '../event/schemas/booking.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Book.name, schema:BookSchema }
      ]),
    ],
  providers: [LibraryService],
  controllers: [LibraryController]
})
export class LibraryModule {}
