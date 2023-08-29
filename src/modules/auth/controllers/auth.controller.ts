import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signInUser(
    @Body() signInData: { username: string; password: string },
  ): Promise<{
    message: string;
    data: Partial<User> & { access_token: string };
  }> {
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
  ): Promise<{
    message: string;
    data: Partial<User>;
  }> {
    const result = await this.authService.register(registerData);

    return {
      message: 'User created successfully.',
      data: result,
    };
  }
}
