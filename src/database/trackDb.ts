import DatabaseError from 'src/errors/database.error';
import {
  CreateTrackDto,
  IFilterOptions,
  Track,
  UpdateTrackDto,
} from 'types/types';
import { v4 as uuidv4 } from 'uuid';

export class TrackDb {
  db: Track[];
  constructor() {
    this.db = [];
  }

  findUnique(filterOprions: IFilterOptions) {
    const filterFields = Object.entries(filterOprions.where);
    const foundRecord = this.db.find((record) => {
      const retval = filterFields.reduce((acc, curr) => {
        const [key, value] = curr;
        return record[key] === value ? acc + 1 : acc;
      }, 0);
      return retval === filterFields.length ? 1 : 0;
    });
    if (!foundRecord) throw new DatabaseError(2, 'track');
    return foundRecord;
  }

  findMany(filterOprions?: IFilterOptions) {
    if (filterOprions) {
      const filterFields = Object.entries(filterOprions.where);
      return this.db.filter((record) => {
        const retval = filterFields.reduce((acc, curr) => {
          const [key, value] = curr;
          return record[key] === value ? acc + 1 : acc;
        }, 0);
        return retval === filterFields.length ? 1 : 0;
      });
    }
    return this.db;
  }

  create(data: CreateTrackDto) {
    const newTrack = {
      id: uuidv4(),
      name: data.name,
      artistId: data.artistId || null,
      albumId: data.albumId || null,
      duration: data.duration,
    };
    this.db.push(newTrack);
    return newTrack;
  }

  update(id: string, data: UpdateTrackDto) {
    const track = this.findUnique({
      where: { id },
    });
    const trackIdx = this.db.indexOf(track);
    this.db[trackIdx] = {
      id: track.id,
      name: data.name,
      artistId: data.artistId || null,
      albumId: data.albumId || null,
      duration: data.duration,
    };
    return this.db[trackIdx];
  }

  delete(id: string) {
    const track = this.findUnique({
      where: { id },
    });
    const recordIdx = this.db.indexOf(track);
    if (recordIdx > -1) this.db.splice(recordIdx, 1);
  }
}
