import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from 'src/routes/artist/artist.service';
import { JwtGuard } from 'src/routes/auth/JwtGuard';
import { CreateArtistDto, UpdateArtistDto } from 'types/types';

@UseGuards(JwtGuard)
@Controller('artist')
export class ArtistController {
  constructor(private readonly ArtistService: ArtistService) {}

  @Get()
  getArtists() {
    return this.ArtistService.getArtists();
  }

  @Get(':id')
  getArtist(@Param('id') id: string) {
    return this.ArtistService.getArtist(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.ArtistService.createArtist(createArtistDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.ArtistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.ArtistService.deleteArtist(id);
  }
}
