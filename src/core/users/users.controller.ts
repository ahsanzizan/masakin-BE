import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import {
  ResponseTemplate,
  TransformInterceptor,
} from 'src/utils/interceptors/transform.interceptor';
import { UsersService } from './users.service';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { UserWithoutPassword } from 'src/utils/selector.utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get users' })
  @UseInterceptors(TransformInterceptor)
  async getFollowers(
    @Query('page') page?: number,
  ): Promise<
    ResponseTemplate<PaginatedResult<Prisma.UserDelegate<DefaultArgs>>>
  > {
    const users = await this.usersService.getUsers({
      page,
    });

    return { message: 'Retrieved users successfully', result: users };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  @UseInterceptors(TransformInterceptor)
  async findById(
    @Param('id') id: string,
  ): Promise<ResponseTemplate<User | null>> {
    const user = await this.usersService.getUser({ id }, UserWithoutPassword);
    if (!user) throw new NotFoundException(`No user found with id: ${id}`);

    return { message: 'Retrieved user successfully', result: user };
  }
}
