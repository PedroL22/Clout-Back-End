import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http';
import { User } from '@prisma/client';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/:identifier')
  async getUser(
    @Param('identifier') identifier: string,
  ): Promise<{ data: Partial<User> } | string | object> {
    const result = await this.usersService.findUser({
      userId: identifier,
      username: identifier,
    });

    if (result instanceof NotFoundException) return result.getResponse();

    return {
      data: { userId: result.userId, username: result.username },
    };
  }

  @Get('users')
  async getUsers(): Promise<{ data: Partial<User>[] }> {
    const users = await this.usersService.findAllUsers({});

    return {
      data: users,
    };
  }

  @Put('users/:userId')
  async putUser(
    @Param('userId') userId: string,
    @Body()
    editData: {
      username: string;
    },
  ): Promise<{ data: Partial<User> } | NotFoundException> {
    const result = await this.usersService.editUserById({
      userId,
      data: editData,
    });

    if (result instanceof NotFoundException) return result;

    return {
      message: 'User edited successfully.',
      data: { userId: result.userId, username: result.username },
    };
  }

  @Delete('users/:userId')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<{ data: Partial<User> } | NotFoundException> {
    const result = await this.usersService.deleteUserById(userId);

    if (result instanceof NotFoundException) return result;

    return {
      message: 'User deleted successfully.',
      data: { userId: result.userId, username: result.username },
    };
  }
}
