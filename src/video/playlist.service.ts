import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Playlist } from './schemas/playlist.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(@InjectModel(Playlist.name) private playlistModel: Model<Playlist>) {}

  async create(dto: CreatePlaylistDto, file?: Express.Multer.File) {
    const playlist = new this.playlistModel({
      ...dto,
      thumbnail: file?.path || '',
    });
    return playlist.save();
  }

  async findAll() {
    return this.playlistModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(id: string, dto: Partial<CreatePlaylistDto>, file?: Express.Multer.File) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    Object.assign(playlist, dto);
    if (file) playlist.thumbnail = file.path;
    return playlist.save();
  }

  async delete(id: string) {
    const playlist = await this.playlistModel.findByIdAndDelete(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    return { message: 'Playlist deleted successfully' };
  }
}
