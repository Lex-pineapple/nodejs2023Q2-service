import { Artist } from 'types/types';

export class ArtistDb {
  db: Artist[];
  constructor() {
    this.db = [];
  }
}
