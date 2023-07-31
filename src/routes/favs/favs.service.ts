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
      Validator.validateUUID(id, category);
      Database[category].findUnique({
        where: { id },
      });
      Database.favorite.addFavorite(id, `${category}s`);
      return `${
        category.charAt(0).toUpperCase() + category.slice(1)
      } ID${id} has been added to favorites`;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteFav(id: string, category: string) {
    try {
      Validator.validateUUID(id, category);
      Database[category].findUnique({
        where: { id },
      });
      Database.favorite.deleteFavorite(id, `${category}s`);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException(
          error.path ? `${error.path}Id is invalid (not uuid)` : error.message,
        );
      if (error.code === 3) throw new BadRequestException(error.message);
      if (error.code === 2)
        throw new UnprocessableEntityException(
          error.path
            ? `${
                error.path.charAt(0).toUpperCase() + error.path.slice(1)
              } with this id does not exist`
            : error.message,
        );
      if (error.code === 101) throw new ForbiddenException(error.message);
      if (error.code === 401) throw new NotFoundException(error.message);
    } else {
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
    }
  }
}
