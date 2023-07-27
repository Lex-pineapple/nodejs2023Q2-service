import DatabaseError from 'src/errors/database.error';
import {
  Artist,
  CreateArtistDto,
  IFilterOptions,
  UpdateArtistDto,
} from 'types/types';
import { v4 as uuidv4 } from 'uuid';

export class ArtistDb {
  db: Artist[];
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
    if (!foundRecord) throw new DatabaseError(2, 'artist');
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

  create(data: CreateArtistDto) {
    const newArtist = {
      id: uuidv4(),
      name: data.name,
      grammy: data.grammy,
    };
    this.db.push(newArtist);
    return newArtist;
  }

  update(id: string, data: UpdateArtistDto) {
    let artist = this.findUnique({
      where: { id },
    });
    artist = {
      id: artist.id,
      name: data.name,
      grammy: data.grammy,
    };
    return artist;
  }

  delete(id: string) {
    const artist = this.findUnique({
      where: { id },
    });
    const recordIdx = this.db.indexOf(artist);
    if (recordIdx > -1) this.db.splice(recordIdx, 1);
  }
}
