import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ILoginDto, IRefreshDto, ISignupDto } from 'types/types';
import * as bcrypt from 'bcryptjs';
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
      const user = await this.prisma.user.findFirst({
        where: { login: data.login },
      });
      if (user) return excludeField(user, ['password']);

      const salt = parseInt(process.env.CRYPT_SALT);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      const result = await this.prisma.user.create({
        data: {
          login: data.login,
          password: hashedPassword,
        },
      });
      return excludeField(result, ['password']);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(data: ILoginDto) {
    try {
      Validator.validateDtoFields(data, Validator.user.schemaCreate);
      const user = await this.validateUser(data);
      if (!user) throw new ValidationError(402);
      const payload = {
        userId: user.id,
        login: user.login,
      };
      return {
        userId: user.id,
        login: user.login,
        accessToken: this.jwt.sign(payload),
        refreshToken: this.jwt.sign(payload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async refresh(refreshDto: IRefreshDto) {
    if (!refreshDto.refreshToken)
      throw new UnauthorizedException('No refreshToken in request body');
    try {
      const refreshData = this.jwt.verify(refreshDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const user = await this.prisma.user.findUnique({
        where: { id: refreshData.userId },
      });

      if (!user) throw new Error();
      const payload = {
        userId: user.id,
        login: user.login,
      };
      return {
        userId: user.id,
        login: user.login,
        accessToken: this.jwt.sign(payload),
        refreshToken: this.jwt.sign(payload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    } catch (error) {
      throw new ForbiddenException(
        'Authentication failed (Refresh token is invalid or expired)',
      );
    }
  }

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
      if (error.code === 401)
        throw new ConflictException('Login already exists');
      if (error.code === 402)
        throw new ForbiddenException('Incorrect login or password');
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
