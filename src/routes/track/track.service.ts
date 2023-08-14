import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Prisma, Track } from '@prisma/client';
import DatabaseError from 'src/errors/database.error';
import { prismaErrors } from 'src/errors/errorDb';
import { ValidationError } from 'src/errors/validation.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeField } from 'src/utils/excludeDbField';
import Validator from 'src/validator/validator';
import { CreateTrackDto, UpdateTrackDto } from 'types/types';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getTracks() {
    const tracks = await this.prisma.track.findMany();
    return tracks.map((track) => this.formatTrack(track));
  }

  async getTrack(id: string) {
    try {
      Validator.validateUUID(id);
      const track = await this.prisma.track.findUnique({
        where: { id },
      });
      if (!track) throw new DatabaseError(202);
      return this.formatTrack(track);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    try {
      Validator.validateDtoFields(createTrackDto, Validator.track.schema);
      await this.checkAvailability(
        createTrackDto.albumId,
        createTrackDto.artistId,
      );
      const track = await this.prisma.track.create({ data: createTrackDto });
      return this.formatTrack(track);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      Validator.validateUUID(id);
      Validator.validateDtoFields(updateTrackDto, Validator.track.schema);
      await this.checkAvailability(
        updateTrackDto.albumId,
        updateTrackDto.artistId,
      );
      const track = await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });
      if (!track) throw new DatabaseError(202);
      return this.formatTrack(track);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteTrack(id: string) {
    try {
      Validator.validateUUID(id);
      // Database.favorite.deleteFavorite(id, 'tracks');
      await this.prisma.track.delete({ where: { id } });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async checkAvailability(albumId: string | null, artistId: string | null) {
    let albumRecord, artistRecord;
    if (albumId) {
      albumRecord = await this.prisma.album.findUnique({
        where: { id: albumId },
      });
      if (!albumRecord) throw new DatabaseError(204);
    }
    if (artistId) {
      artistRecord = await this.prisma.artist.findUnique({
        where: { id: artistId },
      });
      if (!artistRecord) throw new DatabaseError(203);
    }
  }

  formatTrack(track: Track) {
    return excludeField(track, ['isFavorite']);
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('trackId is invalid (not uuid)');
      if (error.code > 200 && error.code < 205)
        throw new NotFoundException(error.message);
      if (error.code === 101) throw new ForbiddenException(error.message);
      if (error.code === 3) throw new BadRequestException(error.message);
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code in prismaErrors.user
    ) {
      throw new NotFoundException(prismaErrors.user.P2025);
    } else {
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
    }
  }
}

export default TrackService;
