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
import { AlbumService } from 'src/routes/album/album.service';
import { CreateAlbumDto, UpdateAlbumDto } from 'types/types';

@Controller('album')
export class AlbumController {
  constructor(private readonly AlbumService: AlbumService) {}

  @Get()
  getAlbums() {
    return this.AlbumService.getAlbums();
  }

  @Get(':id')
  getAlbum(@Param('id') id: string) {
    return this.AlbumService.getAlbum(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.AlbumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.AlbumService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.AlbumService.deleteAlbum(id);
  }
}
