import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const user = await this.usersService.findUser({ username });
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { userId: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
