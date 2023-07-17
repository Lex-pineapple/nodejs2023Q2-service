import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user')
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('/user/:userId')
  getUser(@Param() userId: number) {
    return this.appService.getUser(userId);
  }
}
