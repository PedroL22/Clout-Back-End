import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signInUser(@Body() signInData: { username: string; password: string }) {
    const result = await this.authService.signIn(signInData);

    return {
      message: 'You have been authenticated successfully.',
      data: result,
    };
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
    const registeredUser = await this.authService.register(registerData);

    return {
      message: 'User created successfully.',
      data: {
        userId: registeredUser.userId,
        username: registeredUser.username,
      },
    };
  }
}
