import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
// import { AppService } from './app.service';
import Database from 'src/database/shared';
import { UserService } from 'src/service/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, Database],
})
export class AppModule { }
