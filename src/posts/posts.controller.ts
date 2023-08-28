import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';

import { PostsService } from './posts.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('post/:postId')
  async getPostById(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.post({ postId: postId });
  }

  @Get('posts')
  async getPosts(): Promise<PostModel[]> {
    return this.postsService.posts({});
  }

  @Delete('post/:postId')
  async deletePost(@Param('postId') postId: string): Promise<PostModel> {
    return this.postsService.deletePost({ postId: postId });
  }
}
