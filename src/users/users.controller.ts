import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:userId')
  async getUserId(@Param('userId') userId: number): Promise<User> {
    return this.usersService.findUserById(userId);
  }

  @Get('users/:username')
  async getUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findUserByUsername(username);
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
