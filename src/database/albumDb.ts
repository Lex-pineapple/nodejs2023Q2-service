import DatabaseError from 'src/errors/database.error';
import {
  Album,
  CreateAlbumDto,
  IFilterOptions,
  UpdateAlbumDto,
} from 'types/types';
import { v4 as uuidv4 } from 'uuid';

export class AlbumDb {
  db: Album[];
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
    if (!foundRecord) throw new DatabaseError(2, 'album');
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

  create(data: CreateAlbumDto) {
    const newAlbum = {
      id: uuidv4(),
      name: data.name,
      year: data.year,
      artistId: data.artistId || null,
    };
    this.db.push(newAlbum);
    return newAlbum;
  }

  update(id: string, data: UpdateAlbumDto) {
    const album = this.findUnique({
      where: { id },
    });
    const albumIdx = this.db.indexOf(album);
    this.db[albumIdx] = {
      id: this.db[albumIdx].id,
      name: data.name,
      year: data.year,
      artistId: data.artistId || null,
    };

    return this.db[albumIdx];
  }

  delete(id: string) {
    const album = this.findUnique({
      where: { id },
    });
    const albumIdx = this.db.indexOf(album);
    if (albumIdx > -1) this.db.splice(albumIdx, 1);
  }
}
