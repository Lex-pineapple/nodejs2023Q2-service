import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import Database from 'src/database/shared';
import DatabaseError from 'src/errors/database.error';
import { ValidationError } from 'src/errors/validation.error';
import Validator from 'src/validator/validator';
import { CreateUserDto, UpdatePasswordDto } from 'types/types';

export class UserService {
  getUsers() {
    return Database.user.findMany();
  }

  getUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      const user = Database.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  createUser(createUserDto: CreateUserDto) {
    try {
      Validator.validateDtoFields(createUserDto, Validator.user.schemaCreate);
      const user = Database.user.create(createUserDto);
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      Validator.validateUUID(userId);
      Validator.validateDtoFields(
        updatePasswordDto,
        Validator.user.schemaUpdate,
      );
      return Database.user.update(userId, updatePasswordDto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      Database.user.delete(userId);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1 || error.code === 3)
        throw new BadRequestException(error.message);
      if (error.code === 2) throw new NotFoundException(error.message);
      if (error.code === 101) throw new ForbiddenException(error.message);
    }
  }
}
