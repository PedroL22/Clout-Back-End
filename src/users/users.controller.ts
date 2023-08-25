import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:userId')
  async getUserById(@Param('userId') userId: number): Promise<User> {
    return this.usersService.user(userId);
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.usersService.users({});
  }

  @Post('users')
  async registerUser(data: User): Promise<User> {
    return this.usersService.createUser(data);
  }

  @Put('users/:userId')
  async editUserById(
    @Param('userId') userId: number,
    data: User,
  ): Promise<User> {
    return this.usersService.updateUser({ where: { userId: userId }, data });
  }

  @Delete('users/:userId')
  async deleteUserById(@Param('userId') userId: number): Promise<User> {
    return this.usersService.deleteUser(userId);
  }
}
