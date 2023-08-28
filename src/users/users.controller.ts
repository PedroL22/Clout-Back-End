import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
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

  @UseGuards(AuthGuard)
  @Put('users/:userId')
  async putUser(
    @Request() req,
    @Param('userId') userId: string,
    @Body()
    editData: {
      username: string;
    },
  ): Promise<
    { data: Partial<User> } | NotFoundException | UnauthorizedException
  > {
    const isAdmin = req.user.isAdmin;
    const isOwner = req.user.userId === userId;

    const hasPermission = isAdmin || isOwner;

    if (!hasPermission) {
      throw new UnauthorizedException(
        'You do not have permission to edit this user.',
      );
    }

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

  @UseGuards(AuthGuard)
  @Delete('users/:userId')
  async deleteUser(
    @Request() req,
    @Param('userId') userId: string,
  ): Promise<
    { data: Partial<User> } | NotFoundException | UnauthorizedException
  > {
    const isAdmin = req.user.isAdmin;
    const isOwner = req.user.userId === userId;

    const hasPermission = isAdmin || isOwner;

    if (!hasPermission) {
      throw new UnauthorizedException(
        'You do not have permission to delete this user.',
      );
    }

    const result = await this.usersService.deleteUserById(userId);

    if (result instanceof NotFoundException) return result;

    return {
      message: 'User deleted successfully.',
      data: { userId: result.userId, username: result.username },
    };
  }
}
