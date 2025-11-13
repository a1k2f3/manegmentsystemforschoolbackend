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
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async create(@Body() dto: CreateVideoDto, @UploadedFile() file: Express.Multer.File) {
    return this.videoService.create(dto, file);
  }

  @Get()
  async getAll() {
    return this.videoService.findAll();
  }

  @Get('playlist/:playlistId')
  async getByPlaylist(@Param('playlistId') playlistId: string) {
    return this.videoService.findByPlaylist(playlistId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.videoService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateVideoDto>) {
    return this.videoService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.videoService.delete(id)
  }
}
