import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AlbumController } from 'src/routes/album/album.controller';
import { AlbumService } from 'src/routes/album/album.service';

@Module({
  imports: [PrismaModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
