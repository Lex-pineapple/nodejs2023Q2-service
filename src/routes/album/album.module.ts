import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AlbumController } from 'src/routes/album/album.controller';
import { AlbumService } from 'src/routes/album/album.service';
import { AuthModule } from 'src/routes/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
