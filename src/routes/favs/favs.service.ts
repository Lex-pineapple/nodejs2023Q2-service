import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import DatabaseError from 'src/errors/database.error';
import { prismaErrors } from 'src/errors/errorDb';
import { ValidationError } from 'src/errors/validation.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { createResponse } from 'src/utils/createResponse';
import { excludeField } from 'src/utils/excludeDbField';
import Validator from 'src/validator/validator';
import { Album, Artist, Track } from 'types/types';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addTrack(id: string) {
    try {
      Validator.validateUUID(id);
      const track = await this.prisma.track.update({
        where: { id },
        data: { isFavorite: true },
      });
      if (!track) throw new DatabaseError(202);
      return createResponse('Track has been added to favorites', 201);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async addAlbum(id: string) {
    try {
      Validator.validateUUID(id);
      const album = await this.prisma.album.update({
        where: { id },
        data: { isFavorite: true },
      });
      if (!album) throw new DatabaseError(204);
      return createResponse('Album has been added to favorites', 201);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async addArtist(id: string) {
    try {
      Validator.validateUUID(id);
      const artist = await this.prisma.artist.update({
        where: { id },
        data: { isFavorite: true },
      });
      if (!artist) throw new DatabaseError(203);
      return createResponse('Artist has been added to favorites', 201);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async removeTrack(id: string) {
    try {
      Validator.validateUUID(id);
      const track = await this.prisma.track.update({
        where: { id },
        data: { isFavorite: false },
      });
      if (!track) throw new DatabaseError(401);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async removeAlbum(id: string) {
    try {
      Validator.validateUUID(id);
      const album = await this.prisma.album.update({
        where: { id },
        data: { isFavorite: false },
      });
      if (!album) throw new DatabaseError(401);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async removeArtist(id: string) {
    try {
      Validator.validateUUID(id);
      const artist = await this.prisma.artist.update({
        where: { id },
        data: { isFavorite: false },
      });
      if (!artist) throw new DatabaseError(401);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async getFavs() {
    const tracks = await this.prisma.track.findMany({
      where: { isFavorite: true },
    });
    const albums = await this.prisma.album.findMany({
      where: { isFavorite: true },
    });
    const artists = await this.prisma.artist.findMany({
      where: { isFavorite: true },
    });
    return {
      tracks: this.formatResult(tracks),
      albums: this.formatResult(albums),
      artists: this.formatResult(artists),
    };
  }

  formatResult(array: Album[] | Track[] | Artist[]) {
    return array.map((item) => excludeField(item, ['isFavorite']));
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('ID is invalid (not uuid)');
      if (error.code > 200 && error.code < 205)
        throw new UnprocessableEntityException(error.message);
      if (error.code === 401) throw new NotFoundException(error.message);
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code in prismaErrors.user
    ) {
      throw new UnprocessableEntityException('The item is not in favorites');
    } else {
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
    }
  }
}
