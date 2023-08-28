import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(params: { username: string; password: string }) {
    const { username, password } = params;

    try {
      const result = await this.usersService.findUser({ username });

      if (result instanceof NotFoundException) {
        throw result;
      }

      if (result.password !== password) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const payload = { userId: result.userId, username: result.username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  async register(params: {
    username: string;
    password: string;
    passwordConfirmation: string;
  }) {
    const { username, password, passwordConfirmation } = params;

    if (password !== passwordConfirmation) {
      throw new UnauthorizedException('Passwords do not match.');
    }

    const user = await this.usersService.findUser({ username });
    if (!(user instanceof NotFoundException)) {
      throw new UnauthorizedException('Username already taken.');
    }

    const result = await this.usersService.registerUser({ username, password });
    if (!(result instanceof UnauthorizedException)) {
      return { userId: result.userId, username: result.username };
    }
  }
}
