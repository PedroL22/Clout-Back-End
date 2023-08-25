import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:identifier')
  async getUser(@Param('identifier') identifier: string): Promise<User> {
    const userId = parseInt(identifier, 10);

    if (!isNaN(userId)) {
      return this.usersService.findUserById(userId);
    } else {
      return this.usersService.findUserByUsername(identifier);
    }
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.usersService.findAllUsers({});
  }

  @Post('users')
  async postUser(data: User): Promise<User> {
    return this.usersService.registerUser(data);
  }

  @Put('users/:userId')
  async putUser(@Param('userId') userId: number, data: User): Promise<User> {
    return this.usersService.editUserById({ where: { userId: userId }, data });
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: number): Promise<User> {
    return this.usersService.deleteUserById(userId);
  }
}
