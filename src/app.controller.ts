import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto, UpdatePasswordDto } from 'types/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/user')
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('/user/:userId')
  getUser(@Param('userId') userId: string) {
    return this.appService.getUser(userId);
  }

  @Post('/user')
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  @Put('/user/:userId')
  update(@Param('userId') userId: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.appService.updatePassword(userId, updatePasswordDto);
  }

  @Delete('/user/:userId')
  @HttpCode(204)
  delete(@Param('userId') userId: string) {
    return this.appService.deleteUser(userId);
  }
}
