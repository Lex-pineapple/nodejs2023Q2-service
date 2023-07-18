import UserDb from 'src/database/userDb';
import Validator from 'src/validator/validator';
import { Album, Artist, Favorites, Track } from 'types/types';

class Database {
  user: UserDb;
  artis: Artist[];
  track: Track[];
  album: Album[];
  favorite: Favorites[];
  validator: Validator;
  constructor() {
    this.validator = new Validator();
    this.user = new UserDb();
    // this.artisDb = [];
    // this.trackDb = [];
    // this.albumDb = [];
    // this.favDb = [];
  }


}

export default Database;
