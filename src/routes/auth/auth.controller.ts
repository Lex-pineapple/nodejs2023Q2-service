import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from 'src/routes/auth/auth.service';
import { ILoginDto, IRefreshDto, ISignupDto } from 'types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  signup(@Body() signupDto: ISignupDto) {
    return this.AuthService.register(signupDto);
  }

  @Post('login')
  @HttpCode(201)
  login(@Body() loginDto: ILoginDto) {
    return this.AuthService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(201)
  refresh(@Body() refreshDto: IRefreshDto) {
    return this.AuthService.refresh(refreshDto);
  }
}
