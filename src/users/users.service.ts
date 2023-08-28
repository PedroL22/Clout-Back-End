import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUser(
    UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | NotFoundException> {
    const result = await this.prisma.user.findUnique({
      where: UserWhereUniqueInput,
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
    userId: number;
    data: { username: string };
  }): Promise<User> {
    const { userId, data } = params;
    return this.prisma.user.update({
      data,
      where: { userId: Number(userId) },
    });
  }

  async deleteUserById(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { userId: Number(userId) },
    });
  }
}
