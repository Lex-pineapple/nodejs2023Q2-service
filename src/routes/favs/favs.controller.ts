import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from 'src/routes/favs/favs.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly FavoritesService: FavoritesService) {}

  @Get()
  getFavs() {
    return this.FavoritesService.getFavs();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id') id: string) {
    return this.FavoritesService.addFav(id, 'track');
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@Param('id') id: string) {
    return this.FavoritesService.deleteFav(id, 'track');
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbum(@Param('id') id: string) {
    return this.FavoritesService.addFav(id, 'album');
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@Param('id') id: string) {
    return this.FavoritesService.deleteFav(id, 'album');
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id') id: string) {
    return this.FavoritesService.addFav(id, 'artist');
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@Param('id') id: string) {
    return this.FavoritesService.deleteFav(id, 'artist');
  }
}
