import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import Database from 'src/database/shared';
import DatabaseError from 'src/errors/database.error';
import { ValidationError } from 'src/errors/validation.error';
import Validator from 'src/validator/validator';

export class FavoritesService {
  getFavs() {
    const favs = { ...Database.favorite.findAll() };
    for (const key in favs) {
      favs[key] = [
        ...favs[key].map((item) => {
          const dbCategory = key.slice(0, -1);
          return Database[dbCategory].findUnique({
            where: { id: item },
          });
        }),
      ];
    }
    return favs;
  }

  addFav(id: string, category: string) {
    try {
      Validator.validateUUID(id);
      Database[category].findUnique({
        where: { id },
      });
      Database.favorite.addFavorite(id, `${category}s`);
      return `${category} ID${id} has been added to favorites`;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteFav(id: string, category: string) {
    try {
      Validator.validateUUID(id);
      const item = Database[category].findUnique({
        where: { id },
      });
      Database.favorite.deleteFavorite(id, `${category}s`);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  addTrack(trackId: string) {
    try {
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteTrack(trackId: string) {
    try {
      Validator.validateUUID(trackId);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  addAlbum(albumId: string) {}

  deleteAlbum(albumId: string) {}

  addArtist(artistId: string) {}

  deleteArtist(artistId: string) {}

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1 || error.code === 3)
        throw new BadRequestException(error.message);
      if (error.code === 2)
        throw new UnprocessableEntityException(error.message);
      if (error.code === 101) throw new ForbiddenException(error.message);
      if (error.code === 401) throw new NotFoundException(error.message);
    } else {
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
    }
  }
}
