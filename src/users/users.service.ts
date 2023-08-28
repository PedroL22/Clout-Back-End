import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { validate as validateUUID } from 'uuid';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | NotFoundException> {
    if (validateUUID(userWhereUniqueInput.userId)) {
      const result = await this.prisma.user.findUnique({
        where: {
          userId: userWhereUniqueInput.userId,
        },
      });

      if (!result) {
        return new NotFoundException('User not found.');
      }

      return result;
    }
    const result = await this.prisma.user.findUnique({
      where: {
        username: userWhereUniqueInput.username,
      },
    });

    if (!result) {
      return new NotFoundException('User not found.');
    }

    return result;
  }

  async findAllUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async registerUser(
    data: Prisma.UserCreateInput,
  ): Promise<User | UnauthorizedException> {
    return this.prisma.user.create({
      data,
    });
  }

  async editUserById(params: {
    userId: string;
    data: { username: string };
  }): Promise<User | NotFoundException> {
    const { userId, data } = params;

    try {
      const result = await this.prisma.user.update({
        data,
        where: { userId: userId },
      });

      return result;
    } catch {
      throw new NotFoundException('User not found.');
    }
  }

  async deleteUserById(userId: string): Promise<User | NotFoundException> {
    try {
      const result = await this.prisma.user.delete({
        where: { userId: userId },
      });

      return result;
    } catch {
      throw new NotFoundException('User not found.');
    }
  }
}
