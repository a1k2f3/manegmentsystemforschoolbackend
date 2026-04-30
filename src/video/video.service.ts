import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Video } from './schemas/video.schema';
import { CreateVideoDto } from './dto/create-video.dto';
import { Playlist } from './schemas/playlist.schema';

@Injectable()
export class VideoService {
  
  constructor(
    
     @InjectModel(Playlist.name)
  private playlistModel: Model<Playlist>, // ✅ add this;
    @InjectModel(Video.name) private videoModel: Model<Video>) {}
  async create(dto: CreateVideoDto, file: Express.Multer.File) {
  // 1. Create and save the new video
  const video = new this.videoModel({
    ...dto,
    playlistId: new Types.ObjectId(dto.playlistId),
    videoUrl: file ? file.path : '',
  });
  const savedVideo = await video.save();
  // 2. Update the Playlist to include this video ID
  await this.playlistModel.findByIdAndUpdate(
    dto.playlistId,
    { $push: { videos: savedVideo._id } },
    { new: true, useFindAndModify: false }
  );

  return savedVideo;
}

  async findAll() {
    return this.videoModel.find().populate('playlistId').sort({ createdAt: -1 });
  }

  async findByPlaylist(playlistId: string) {
    return this.videoModel.find({ playlistId }).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const video = await this.videoModel.findById(id).populate('playlistId');
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async update(id: string, dto: Partial<CreateVideoDto>, file?: Express.Multer.File) {
    const video = await this.videoModel.findById(id);
    if (!video) throw new NotFoundException('Video not found');
    Object.assign(video, dto);
    if (file) video.videoUrl = file.path;
    return video.save();
  }

  async delete(id: string) {
    const video = await this.videoModel.findByIdAndDelete(id);
    if (!video) throw new NotFoundException('Video not found');
    return { message: 'Video deleted successfully' };
  }
}
