import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from './routes/user/user.module';
import { TrackModule } from './routes/track/track.module';

@Module({
  imports: [UserModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
