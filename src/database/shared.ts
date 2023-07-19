import TrackDb from 'src/database/trackDb';
import UserDb from 'src/database/userDb';
import { Album, Artist, Favorites } from 'types/types';

class Database {
  public static user: UserDb = new UserDb();
  public static artis: Artist[] = [];
  public static track: TrackDb = new TrackDb();
  public static album: Album[] = [];
  public static favorite: Favorites[] = [];
}

export default Database;
