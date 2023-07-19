import { Controller, Get } from '@nestjs/common';
import TrackService from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly TrackService: TrackService) { }

  @Get()
  getTracks() {
    return this.TrackService.getTracks();
  }
}
