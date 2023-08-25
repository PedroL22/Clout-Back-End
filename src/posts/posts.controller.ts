import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core';
import { Post as PostModel } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('post/:postId')
  async getPostById(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.post({ postId: Number(postId) });
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postsService.posts({
      where: { published: true },
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postsService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @UseGuards(AuthGuard)
  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; username: string },
  ): Promise<PostModel> {
    const { title, content, username } = postData;
    return this.postsService.createPost({
      title,
      content,
      author: {
        connect: { username: username },
      },
    });
  }

  @Put('publish/:postId')
  async publishPost(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.updatePost({
      where: { postId: Number(postId) },
      data: { published: true },
    });
  }

  @Delete('post/:postId')
  async deletePost(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.deletePost({ postId: Number(postId) });
  }
}
