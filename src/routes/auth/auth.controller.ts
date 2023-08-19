import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/routes/auth/JwtGuard';
import { AuthService } from 'src/routes/auth/auth.service';
import { ILoginDto, IRefreshDto, ISignupDto } from 'types/types';

@UseGuards(JwtGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signup(@Body() signupDto: ISignupDto) {
    return this.AuthService.register(signupDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: ILoginDto) {
    const payload = await this.AuthService.login(loginDto);
    return payload;
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() refreshDto: IRefreshDto) {
    return this.AuthService.refresh(refreshDto);
  }
}
