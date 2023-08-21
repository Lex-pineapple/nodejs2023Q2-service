import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Album, Prisma } from '@prisma/client';
import DatabaseError from 'src/errors/database.error';
import { prismaErrors } from 'src/errors/errorDb';
import { ValidationError } from 'src/errors/validation.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeField } from 'src/utils/excludeDbField';
import Validator from 'src/validator/validator';
import { CreateAlbumDto, UpdateAlbumDto } from 'types/types';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async getAlbums() {
    const albums = await this.prisma.album.findMany();
    return albums.map((album) => this.formatAlbum(album));
  }

  async getAlbum(id: string) {
    try {
      Validator.validateUUID(id);
      const album = await this.prisma.album.findUnique({
        where: { id },
      });
      if (!album) throw new DatabaseError(204);
      return this.formatAlbum(album);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    try {
      Validator.validateDtoFields(createAlbumDto, Validator.album.schema);
      this.checkAvailability(createAlbumDto.artistId);
      const album = await this.prisma.album.create({ data: createAlbumDto });
      return this.formatAlbum(album);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      Validator.validateUUID(id);
      Validator.validateDtoFields(updateAlbumDto, Validator.album.schema);
      this.checkAvailability(updateAlbumDto.artistId);
      const album = await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
      });
      if (!album) throw new DatabaseError(204);
      return this.formatAlbum(album);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteAlbum(id: string) {
    try {
      Validator.validateUUID(id);
      await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async checkAvailability(artistId: string | null) {
    let artistRecord;
    if (artistId) {
      artistRecord = await this.prisma.artist.findUnique({
        where: { id: artistId },
      });
      if (!artistRecord) throw new DatabaseError(203);
    }
  }

  formatAlbum(album: Album) {
    return excludeField(album, ['isFavorite']);
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('albumId is invalid (not uuid)');
      if (error.code > 200 && error.code < 205)
        throw new NotFoundException(error.message);
      if (error.code === 101) throw new ForbiddenException(error.message);
      if (error.code === 3) throw new BadRequestException(error.message);
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code in prismaErrors.user
    ) {
      throw new NotFoundException(prismaErrors.user.P2025);
    } else
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
  }
}
