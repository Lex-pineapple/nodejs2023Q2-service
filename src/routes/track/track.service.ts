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
import { CreateTrackDto, UpdateTrackDto } from 'types/types';

export class TrackService {
  getTracks() {
    return Database.track.findMany();
  }

  getTrack(id: string) {
    try {
      Validator.validateUUID(id);
      const track = Database.track.findUnique({
        where: { id },
      });
      return track;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  createTrack(createTrackDto: CreateTrackDto) {
    try {
      Validator.validateDtoFields(createTrackDto, Validator.track.schema);
      const track = Database.track.create(createTrackDto);
      return track;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      Validator.validateUUID(id);
      Validator.validateDtoFields(updateTrackDto, Validator.track.schema);
      return Database.track.update(id, updateTrackDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteTrack(id: string) {
    try {
      Validator.validateUUID(id);
      Database.track.delete(id);
      Database.favorite.deleteFavorite(id, 'tracks');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('trackId is invalid (not uuid)');
      if (error.code === 3) throw new BadRequestException(error.message);
      if (error.code === 2) throw new NotFoundException('Track was not found');
      if (error.code === 101) throw new ForbiddenException(error.message);
    } else {
      console.log(error);

      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
    }
  }
}

export default TrackService;
