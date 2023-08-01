import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Artist, Prisma } from '@prisma/client';
import DatabaseError from 'src/errors/database.error';
import { prismaErrors } from 'src/errors/errorDb';
import { ValidationError } from 'src/errors/validation.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeField } from 'src/utils/excludeDbField';
import Validator from 'src/validator/validator';
import { CreateArtistDto, UpdateArtistDto } from 'types/types';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getArtists() {
    const artist = await this.prisma.artist.findMany();
    return artist.map((artist) => this.formatArtist(artist));
  }

  async getArtist(id: string) {
    try {
      Validator.validateUUID(id);
      const artist = await this.prisma.artist.findUnique({ where: { id } });
      if (!artist) throw new DatabaseError(203);
      return this.formatArtist(artist);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    try {
      Validator.validateDtoFields(createArtistDto, Validator.artist.schema);
      const artist = await this.prisma.artist.create({ data: createArtistDto });
      return this.formatArtist(artist);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      Validator.validateUUID(id);
      Validator.validateDtoFields(updateArtistDto, Validator.artist.schema);
      const artist = await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
      });
      if (!artist) throw new DatabaseError(203);
      return this.formatArtist(artist);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteArtist(id: string) {
    try {
      Validator.validateUUID(id);
      await this.prisma.artist.delete({ where: { id } });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  formatArtist(artist: Artist) {
    return excludeField(artist, ['isFavorite']);
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('artistId is invalid (not uuid)');
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
