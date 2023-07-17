import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/user')
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('/user/:userId')
  getUser(@Param('userId') userId: string) {
    return this.appService.getUser(userId);
  }
}
