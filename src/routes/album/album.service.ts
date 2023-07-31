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
import { CreateAlbumDto, UpdateAlbumDto } from 'types/types';

export class AlbumService {
  getAlbums() {
    return Database.album.findMany();
  }

  getAlbum(id: string) {
    try {
      Validator.validateUUID(id);
      const album = Database.album.findUnique({
        where: { id },
      });
      return album;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  createAlbum(createAlbumDto: CreateAlbumDto) {
    try {
      Validator.validateDtoFields(createAlbumDto, Validator.album.schema);
      const album = Database.album.create(createAlbumDto);
      return album;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      Validator.validateUUID(id);
      Validator.validateDtoFields(updateAlbumDto, Validator.album.schema);
      return Database.album.update(id, updateAlbumDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteAlbum(id: string) {
    try {
      Validator.validateUUID(id);
      Database.album.delete(id);
      const tracks = Database.track.findMany({
        where: { albumId: id },
      });
      tracks.forEach((track) => {
        Database.track.update(track.id, { albumId: null });
      });
      Database.favorite.deleteFavorite(id, 'albums');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('albumId is invalid (not uuid)');
      if (error.code === 3) throw new BadRequestException(error.message);
      if (error.code === 2) throw new NotFoundException('Album was not found');
      if (error.code === 101) throw new ForbiddenException(error.message);
    } else
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
  }
}
