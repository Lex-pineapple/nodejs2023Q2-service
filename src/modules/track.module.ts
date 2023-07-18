import { Module } from '@nestjs/common';
import { TrackController } from 'src/controllers/track.controller';
import TrackService from 'src/service/track.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
