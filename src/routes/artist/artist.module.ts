import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ArtistController } from 'src/routes/artist/artist.controller';
import { ArtistService } from 'src/routes/artist/artist.service';
import { AuthModule } from 'src/routes/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
