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
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof ValidationError)
        this.handleExceptions(error.code, error.message);
    }
  }

  createUser(createUserDto: CreateUserDto) {
    try {
      Validator.validateDtoFields(createUserDto, Validator.user.schemaCreate);
      const user = Database.user.create(createUserDto);
      return user;
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof ValidationError)
        this.handleExceptions(error.code, error.message);
    }
  }

  updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      Validator.validateUUID(userId);
      Validator.validateDtoFields(updatePasswordDto, Validator.user.schemaUpdate);
      Database.user.update(userId, updatePasswordDto);
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof ValidationError)
        this.handleExceptions(error.code, error.message);
    }
  }

  deleteUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      Database.user.delete(userId);
    } catch (error) {
      if (error instanceof DatabaseError)
        this.handleExceptions(error.code, error.message);
    }
  }

  handleExceptions(code: number, message: string) {
    if (code === 1 || code === 3) throw new BadRequestException(message);
    if (code === 2) throw new NotFoundException(message);
    if (code === 101) throw new ForbiddenException(message);
  }
}
