import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ILoginDto, IRefreshDto, ISignupDto } from 'types/types';
import * as bcrypt from 'bcrypt';
import { excludeField } from 'src/utils/excludeDbField';
import Validator from 'src/validator/validator';
import { Prisma } from '@prisma/client';
import DatabaseError from 'src/errors/database.error';
import { prismaErrors } from 'src/errors/errorDb';
import { ValidationError } from 'src/errors/validation.error';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: ISignupDto) {
    try {
      Validator.validateDtoFields(data, Validator.user.schemaCreate);
      const user = this.prisma.user.findFirst({
        where: { login: data.login },
      });
      if (user) throw new ConflictException('Login already exists');
      const salt = parseInt(process.env.CRYPT_SALT);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const result = await this.prisma.user.create({
        data: {
          login: data.login,
          password: hashedPassword,
        },
      });
      return result;
      return excludeField(result, ['password']);
    } catch (error) {
      console.error(error);

      // this.handleExceptions(error);
    }
  }

  async login(data: ILoginDto) {
    const user = await this.validateUser(data);
    if (!user) throw new ForbiddenException('Incorrect login or password');
    const payload = {
      username: user.login,
      sub: user.id,
    };
    return {
      access_token: this.jwt.sign(payload),
    };
  }

  async refresh(refreshDto: IRefreshDto) {}

  async validateUser(data: ILoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { login: data.login },
    });
    if (!user) return null;
    const passwordValid = await bcrypt.compare(data.password, user.password);
    if (passwordValid && user) return user;
    return null;
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
