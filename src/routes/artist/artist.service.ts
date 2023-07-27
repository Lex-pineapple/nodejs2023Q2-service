import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import Database from 'src/database/shared';
import DatabaseError from 'src/errors/database.error';
import { ValidationError } from 'src/errors/validation.error';
import Validator from 'src/validator/validator';
import { CreateArtistDto, UpdateArtistDto } from 'types/types';

export class ArtistService {
  getArtists() {
    return Database.artist.findMany();
  }

  getArtist(id: string) {
    try {
      Validator.validateUUID(id);
      const artist = Database.artist.findUnique({
        where: { id },
      });
      return artist;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  createArtist(createArtistDto: CreateArtistDto) {
    try {
      Validator.validateDtoFields(createArtistDto, Validator.artist.schema);
      const artist = Database.artist.create(createArtistDto);
      return artist;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      Validator.validateUUID(id);
      Validator.validateDtoFields(updateArtistDto, Validator.artist.schema);
      return Database.artist.update(id, updateArtistDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteArtist(id: string) {
    try {
      Validator.validateUUID(id);
      Database.artist.delete(id);
      // Update track db
      const tracks = Database.track.findMany({
        where: { artistId: id },
      });
      tracks.forEach((track) => {
        Database.track.update(track.id, { artistId: null });
      });
      // Update album db
      const albums = Database.album.findMany({
        where: { artistId: id },
      });
      albums.forEach((album) => {
        Database.album.update(album.id, { artistId: null });
      });
      // Update favs db
      Database.favorite.deleteFavorite(id, 'artists');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('artistId is invalid (not uuid)');
      if (error.code === 3) throw new BadRequestException(error.message);
      if (error.code === 2) throw new NotFoundException('Artist was not found');
      if (error.code === 101) throw new ForbiddenException(error.message);
    } else
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
  }
}
