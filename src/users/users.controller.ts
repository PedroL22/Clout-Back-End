import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:identifier')
  async getUser(@Param('identifier') identifier: string) {
    const userId = parseInt(identifier, 10);
    if (!isNaN(userId)) {
      const user = await this.usersService.findUser({ userId });

      return {
        data: {
          userId: user.userId,
          username: user.username,
        },
      };
    } else {
      const user = await this.usersService.findUser({ username: identifier });

      return {
        data: {
          userId: user.userId,
          username: user.username,
        },
      };
    }
  }

  @Get('users')
  async getUsers(): Promise<{ data: User[] }> {
    const users = await this.usersService.findAllUsers({});

    return { data: users };
  }

  @Put('users/:userId')
  async putUser(
    @Param('userId') userId: number,
    @Body()
    editData: {
      username: string;
    },
  ) {
    const editedUser = await this.usersService.editUserById({
      userId,
      data: editData,
    });

    return {
      message: 'User edited successfully.',
      data: { userId: editedUser.userId, username: editedUser.username },
    };
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: number) {
    const deletedUser = await this.usersService.deleteUserById(userId);

    return {
      message: 'User deleted successfully.',
      data: { userId: deletedUser.userId, username: deletedUser.username },
    };
  }
}
