import { Album } from 'types/types';

export class AlbumDb {
  db: Album[];
  constructor() {
    this.db = [];
  }
}
