import { AlbumDb } from 'src/database/albumDb';
import { ArtistDb } from 'src/database/artistDB';
import { FavsDb } from 'src/database/favsDb';
import { TrackDb } from 'src/database/trackDb';
import { UserDb } from 'src/database/userDb';

class Database {
  public static user: UserDb = new UserDb();
  public static artist: ArtistDb = new ArtistDb();
  public static track: TrackDb = new TrackDb();
  public static album: AlbumDb = new AlbumDb();
  public static favorite: FavsDb = new FavsDb();
}

export default Database;
