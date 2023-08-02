export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface CreateTrackDto {
  name: string;
  artistId?: string; // refers to Artist
  albumId?: string; // refers to Album
  duration: number;
}

export interface UpdateTrackDto {
  name?: string;
  artistId?: string | null; // refers to Artist
  albumId?: string | null; // refers to Album
  duration?: number;
}

export interface CreateArtistDto {
  name: string;
  grammy: boolean;
}

export interface UpdateArtistDto {
  name: string;
  grammy: boolean;
}

export interface CreateAlbumDto {
  name: string;
  year: number;
  artistId?: string;
}

export interface UpdateAlbumDto {
  name?: string;
  year?: number;
  artistId?: string;
}

export interface IFilterOptions {
  where:
    | Partial<User>
    | Partial<Artist>
    | Partial<Track>
    | Partial<Album>
    | Partial<Favorites>;
}

export interface ISignupDto {
  login: string;
  password: string;
}

export interface ILoginDto {
  login: string;
  password: string;
}

export interface IRefreshDto {
  refreshToken: string;
}
