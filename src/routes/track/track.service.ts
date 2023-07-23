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
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  updateTrack(id: string, updateTrackDto: UpdateTrackDto) {}

  deleteTrack(id: string) {}

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1 || error.code === 3)
        throw new BadRequestException(error.message);
      if (error.code === 2) throw new NotFoundException(error.message);
      if (error.code === 101) throw new ForbiddenException(error.message);
    } else
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
  }
}

export default TrackService;
