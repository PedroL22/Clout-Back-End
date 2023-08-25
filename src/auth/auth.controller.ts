import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signInUser(@Body() signInData: { username: string; password: string }) {
    return this.authService.signIn(signInData);
  }

  @Post('register')
  async registerUser(
    @Body()
    registerData: {
      username: string;
      password: string;
      passwordConfirmation: string;
    },
  ) {
    return this.authService.register(registerData);
  }
}
