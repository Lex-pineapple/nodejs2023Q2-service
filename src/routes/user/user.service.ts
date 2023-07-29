import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import Database from 'src/database/shared';
import DatabaseError from 'src/errors/database.error';
import { ValidationError } from 'src/errors/validation.error';
import { PrismaService } from 'src/prisma/prisma.service';
import Validator from 'src/validator/validator';
import { CreateUserDto, UpdatePasswordDto } from 'types/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      return this.excludeField(user, ['password']);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      Validator.validateDtoFields(createUserDto, Validator.user.schemaCreate);
      const user = await this.prisma.user.create({ data: createUserDto });
      return this.excludeField(user, ['password']);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      Validator.validateUUID(userId);
      Validator.validateDtoFields(
        updatePasswordDto,
        Validator.user.schemaUpdate,
      );
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: updatePasswordDto.newPassword,
          version: {
            increment: 1,
          },
        },
      });
      return this.excludeField(user, ['password']);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  deleteUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      return this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  excludeField(user: User, keys: string[]) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key)),
    );
  }

  handleExceptions(error: any) {
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      if (error.code === 1)
        throw new BadRequestException('userId is invalid (not uuid)');
      if (error.code === 3) throw new BadRequestException(error.message);
      if (error.code === 2) throw new NotFoundException('User not found');
      if (error.code === 101) throw new ForbiddenException(error.message);
    } else
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
  }
}
