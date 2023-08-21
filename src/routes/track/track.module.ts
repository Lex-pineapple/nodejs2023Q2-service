import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import TrackService from './track.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/routes/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
