import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto, UpdatePasswordDto } from 'types/types';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Get()
  getUsers() {
    return this.UserService.getUsers();
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.UserService.getUser(userId);
  }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserService.createUser(createUserDto);
  }

  @Put(':userId')
  update(@Param('userId') userId: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.UserService.updatePassword(userId, updatePasswordDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  delete(@Param('userId') userId: string) {
    return this.UserService.deleteUser(userId);
  }
}
