import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';
import { Video, VideoSchema } from './schemas/video.schema';
import { PlaylistService } from './playlist.service';
import { VideoService } from './video.service';
import { PlaylistController } from './playlist.controller';
import { VideoController } from './video.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
      { name: Video.name, schema: VideoSchema },
    ]),
  ],
  controllers: [PlaylistController, VideoController],
  providers: [PlaylistService, VideoService],
})
export class VideoModule {}
