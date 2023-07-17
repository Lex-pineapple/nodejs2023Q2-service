import UserDb from 'src/database/userDb';
import { Album, Artist, Favorites, Track } from 'types/types';

class Database {
  user: UserDb;
  artis: Artist[];
  track: Track[];
  album: Album[];
  favorite: Favorites[];
  constructor() {
    this.user = new UserDb();
    // this.artisDb = [];
    // this.trackDb = [];
    // this.albumDb = [];
    // this.favDb = [];
  }

  validateId(id: string) {
    const uuidRegExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return uuidRegExp.test(id);
  }
}

export default Database;
