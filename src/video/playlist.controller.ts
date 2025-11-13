import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async create(@Body() dto: CreatePlaylistDto, @UploadedFile() file: Express.Multer.File) {
    return this.playlistService.create(dto, file);
  }

  @Get()
  async getAll() {
    return this.playlistService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.playlistService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreatePlaylistDto>) {
    return this.playlistService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.playlistService.delete(id);
  }
}
