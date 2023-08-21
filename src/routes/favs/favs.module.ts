import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/routes/auth/auth.module';
import { FavoritesController } from 'src/routes/favs/favs.controller';
import { FavoritesService } from 'src/routes/favs/favs.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
