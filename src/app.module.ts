import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from './routes/user/user.module';
import { TrackModule } from './routes/track/track.module';
import { ArtistModule } from 'src/routes/artist/artist.module';
import { AlbumModule } from 'src/routes/album/album.module';
import { FavoritesModule } from 'src/routes/favs/favs.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from 'src/routes/auth/auth.module';
import { LoggingModule } from 'src/log/log.module';
import { LoggerMiddleware } from 'src/log/log.middleware';
import { HttpExceptionFilter } from 'src/log/exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/routes/auth/JwtGuard';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
