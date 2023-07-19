import Database from 'src/database/shared';
import { CreateTrackDto, UpdateTrackDto } from 'types/types';

export class TrackService {
  getTracks() {
    return Database.track.findMany();
  }

  getTrack(id: string) {}

  createTrack(createTrackDto: CreateTrackDto) {}

  updateTrack(id: string, updateTrackDto: UpdateTrackDto) {}

  deleteTrack(id: string) {}
}

export default TrackService;
