import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import DatabaseError from 'src/errors/database.error';
import { prismaErrors } from 'src/errors/errorDb';
import { ValidationError } from 'src/errors/validation.error';
import { PrismaService } from 'src/prisma/prisma.service';
import { excludeField } from 'src/utils/excludeDbField';
import Validator from 'src/validator/validator';
import { CreateUserDto, UpdatePasswordDto } from 'types/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.formatUser(user));
  }

  async getUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new DatabaseError(201);
      return this.formatUser(user);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      Validator.validateDtoFields(createUserDto, Validator.user.schemaCreate);
      const user = await this.prisma.user.create({ data: createUserDto });
      return this.formatUser(user);
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
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new DatabaseError(201);
      Validator.validatePassword(user.password, updatePasswordDto.oldPassword);
      const updUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: updatePasswordDto.newPassword,
          version: {
            increment: 1,
          },
        },
      });
      return this.formatUser(updUser);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deleteUser(userId: string) {
    try {
      Validator.validateUUID(userId);
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  formatUser(user: User) {
    const newUser = excludeField(user, ['password']);
    return {
      ...newUser,
      createdAt: new Date(newUser.createdAt).getTime(),
      updatedAt: new Date(newUser.updatedAt).getTime(),
    };
  }

  handleExceptions(error: any) {
    if (error instanceof ValidationError || error instanceof DatabaseError) {
      if (error.code === 1)
        throw new BadRequestException('userId is invalid (not uuid)');
      if (error.code > 200 && error.code < 205)
        throw new NotFoundException(error.message);
      if (error.code === 101) throw new ForbiddenException(error.message);
      if (error.code === 3) throw new BadRequestException(error.message);
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code in prismaErrors.user
    ) {
      throw new NotFoundException(prismaErrors.user.P2025);
    } else {
      throw new InternalServerErrorException(
        'Whoops... There was a server error!',
      );
    }
  }
}
