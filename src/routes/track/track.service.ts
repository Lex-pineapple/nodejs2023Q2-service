import Database from 'src/database/shared';

export class TrackService {
  getTracks() {
    return Database.track.findMany();
  }
}

export default TrackService;
