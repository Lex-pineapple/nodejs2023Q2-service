import { Module } from '@nestjs/common';
import { FavoritesController } from 'src/routes/favs/favs.controller';
import { FavoritesService } from 'src/routes/favs/favs.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
