import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts/:postId')
  async getPostById(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.findPost({ postId: postId });
  }

  @Get('posts')
  async getPosts(): Promise<PostModel[]> {
    return this.postsService.findAllPosts({});
  }

  @UseGuards(AuthGuard)
  @Post('posts')
  async postPost(@Body() data: PostModel): Promise<PostModel> {
    return this.postsService.createPost({
      ...data,
      author: {
        connect: { userId: data.authorId },
      },
    });
  }

  @UseGuards(AuthGuard)
  @Put('posts/:postId')
  async putPost(
    @Param('postId') postId: string,
    @Body()
    editData: {
      title: string;
      content: string;
    },
  ) {
    const result = await this.postsService.editPostById({
      postId,
      data: editData,
    });

    if (result instanceof NotFoundException) return result;

    return {
      message: 'Post edited successfully.',
      data: { result },
    };
  }

  @UseGuards(AuthGuard)
  @Delete('posts/:postId')
  async deletePost(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.deletePostById({ postId: postId });
  }
}
