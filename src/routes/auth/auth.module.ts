import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from 'src/routes/auth/auth.controller';
import { JwtGuard } from 'src/routes/auth/JwtGuard';
import { AuthService } from 'src/routes/auth/auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      // global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtModule],
})
export class AuthModule {}
