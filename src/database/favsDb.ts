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
}
