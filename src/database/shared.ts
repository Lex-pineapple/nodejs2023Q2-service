import UserDb from 'src/database/userDb';
import Validator from 'src/validator/validator';
import { Album, Artist, Favorites, Track, User } from 'types/types';

class Database {
  public static user: UserDb = new UserDb();
  public static artis: Artist[] = [];
  public static track: Track[] = [];
  public static album: Album[] = [];
  public static favorite: Favorites[] = [];
  public static validator = new Validator();
}

export default Database;
