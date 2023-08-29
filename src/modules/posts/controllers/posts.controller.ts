import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { Post as PostModel } from '@prisma/client'

import { AuthGuard } from 'src/common/auth.guard'
import { PostsService } from '../services/posts.service'

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts/:postId')
  async getPost(@Param('postId') postId: string): Promise<{ data: Partial<PostModel> } | string | object> {
    const result = await this.postsService.findPost({
      postId: postId,
    })

    if (result instanceof NotFoundException) return result.getResponse()

    return {
      data: result,
    }
  }

  @Get('posts')
  async getPosts(): Promise<{ data: Partial<PostModel>[] }> {
    const posts = await this.postsService.findAllPosts({})

    return {
      data: posts,
    }
  }

  @UseGuards(AuthGuard)
  @Post('posts')
  async postPost(
    @Request() req,
    @Body() createData: { title: string; content: string }
  ): Promise<{
    message: string
    data: Partial<PostModel>
  }> {
    const userId = req.user.userId

    const result = await this.postsService.createPost({
      ...createData,
      author: {
        connect: { userId: userId },
      },
    })

    return {
      message: 'Post created successfully.',
      data: result,
    }
  }

  @UseGuards(AuthGuard)
  @Put('posts/:postId')
  async putPost(
    @Request() req,
    @Param('postId') postId: string,
    @Body()
    editData: {
      authorId: string
      title: string
      content: string
    }
  ): Promise<{ data: Partial<PostModel> } | NotFoundException | UnauthorizedException> {
    const isAdmin = req.user.isAdmin
    const isOwner = req.user.userId === editData.authorId

    const hasPermission = isAdmin || isOwner

    if (!hasPermission) {
      throw new UnauthorizedException('You do not have permission to edit this post.')
    }

    const result = await this.postsService.editPostById({
      postId,
      data: editData,
    })

    if (result instanceof NotFoundException) return result

    return {
      message: 'Post edited successfully.',
      data: result,
    }
  }

  @UseGuards(AuthGuard)
  @Delete('posts/:postId')
  async deletePost(
    @Request() req,
    @Param('postId') postId: string
  ): Promise<{ data: Partial<PostModel> } | NotFoundException | UnauthorizedException> {
    const selectedPost = await this.postsService.findPost({
      postId: postId,
    })

    if (selectedPost instanceof NotFoundException) return selectedPost

    const isAdmin = req.user.isAdmin
    const isOwner = req.user.userId === selectedPost.authorId

    const hasPermission = isAdmin || isOwner

    if (!hasPermission) {
      throw new UnauthorizedException('You do not have permission to delete this post.')
    }

    const result = await this.postsService.deletePostById({ postId: postId })

    if (result instanceof NotFoundException) return result

    return {
      message: 'Post deleted successfully.',
      data: { postId: result.postId, title: result.title },
    }
  }
}
