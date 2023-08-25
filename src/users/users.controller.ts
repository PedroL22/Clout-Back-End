import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:identifier')
  async getUser(@Param('identifier') identifier: string): Promise<User> {
    const userId = parseInt(identifier, 10);
    if (!isNaN(userId)) {
      return this.usersService.findUser({ userId });
    } else {
      return this.usersService.findUser({ username: identifier });
    }
  }

  @Get('users')
  async getUsers(): Promise<User[]> {
    return this.usersService.findAllUsers({});
  }

  @Put('users/:userId')
  async putUser(
    @Param('userId') userId: number,
    @Body()
    editData: {
      username: string;
    },
  ): Promise<User> {
    return this.usersService.editUserById({
      userId,
      data: editData,
    });
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: number): Promise<User> {
    return this.usersService.deleteUserById(userId);
  }
}
