import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import TrackService from './track.service';
import { CreateTrackDto, UpdateTrackDto } from 'types/types';

@Controller('track')
export class TrackController {
  constructor(private readonly TrackService: TrackService) {}

  @Get()
  getTracks() {
    return this.TrackService.getTracks();
  }

  @Get(':id')
  getTrack(@Param('id') id: string) {
    return this.TrackService.getTrack(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.TrackService.createTrack(createTrackDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.TrackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.TrackService.deleteTrack(id);
  }
}
