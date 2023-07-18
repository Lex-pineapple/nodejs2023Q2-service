import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from 'src/modules/user.module';
import { TrackModule } from 'src/modules/track.module';

@Module({
  imports: [UserModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
