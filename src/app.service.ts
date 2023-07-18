import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import DatabaseError from 'src/database/errorDb';
import Database from 'src/database/mainDb';
import Validator from 'src/validator/validator';
import { CreateUserDto, UpdatePasswordDto } from 'types/types';

@Injectable()
export class AppService {
  database: Database;

  constructor() {
    this.database = new Database();
  }

  getUsers() {
    return this.database.user.findMany();
  }

  getUser(userId: string) {
    try {
      this.database.validator.validateUUID(userId);
      const user = this.database.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      if (error instanceof DatabaseError) this.handleExceptions(error.code, error.message);
    }
  }

  createUser(createUserDto: CreateUserDto) {
    try {
      this.database.validator.validateUserCreate(createUserDto);
      const user = this.database.user.create(createUserDto);
      return user;
    } catch (error) {
      if (error instanceof DatabaseError) this.handleExceptions(error.code, error.message);
    }
  }

  updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      this.database.validator.validateUUID(userId);
      this.database.validator.validateUserUpdate(updatePasswordDto);
      this.database.user.update(userId, updatePasswordDto);
    } catch (error) {
      if (error instanceof DatabaseError) this.handleExceptions(error.code, error.message);
    }
  }

  deleteUser(userId: string) {
    try {
      this.database.validator.validateUUID(userId);
      this.database.user.delete(userId);
    } catch (error) {
      if (error instanceof DatabaseError) this.handleExceptions(error.code, error.message);
    }
  }

  handleExceptions(code: number, message: string) {
    if (code === 1 || code === 3) throw new BadRequestException(message);
    if (code === 2) throw new NotFoundException(message);
    if (code === 101) throw new ForbiddenException(message);
  }
}
