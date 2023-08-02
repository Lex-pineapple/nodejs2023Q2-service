import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISignupDto } from 'types/types';
import * as bcrypt from 'bcrypt';
import { excludeField } from 'src/utils/excludeDbField';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: ISignupDto) {
    const salt = process.env.CRYPT_SALT;
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const result = await this.prisma.user.create({
      data: {
        login: data.login,
        password: hashedPassword,
      },
    });
    return excludeField(result, ['password']);
  }
}
