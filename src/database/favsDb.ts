import DatabaseError from 'src/errors/database.error';
import { Favorites } from 'types/types';

export class FavsDb {
  db: Favorites;
  constructor() {
    this.db = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }

  findAll() {
    return this.db;
  }

  findById(id: string, category: string) {
    const record = this.db[category].find((record) => record === id);
    if (!record) throw new DatabaseError(401);
    return record;
  }

  addFavorite(favId: string, category: string) {
    this.db[category].push(favId);
  }

  deleteFavorite(id: string, category: string) {
    const record = this.findById(id, category);
    const recordIdx = this.db[category].indexOf(record);
    if (recordIdx > -1) this.db[category].splice(recordIdx, 1);
  }
}
