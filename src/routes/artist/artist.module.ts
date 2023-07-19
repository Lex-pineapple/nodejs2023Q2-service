import { Module } from '@nestjs/common';
import { ArtistController } from 'src/routes/artist/artist.controller';
import { ArtistService } from 'src/routes/artist/artist.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
