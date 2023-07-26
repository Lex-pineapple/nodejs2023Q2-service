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
import { Album, Artist, Track } from 'types/types';

export class FavoritesService {
  keys = {
    tracks: 'track',
    artists: 'artist',
    albums: 'album',
  };
  getFavs() {
    try {
      const favs = { ...Database.favorite.findAll() };
      for (const key in favs) {
        const keyIds: Artist[] | Album[] | Track[] = [...favs[key]];
        const mappedRecords = keyIds.map((id) => {
          return Database[this.keys[key]].findUnique({
            where: { id },
          });
        });
        favs[key] = [...mappedRecords];
      }
      return favs;
    } catch (error) {
      this.handleExceptions(error);
    }
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
