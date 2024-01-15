import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { UserWithoutPasswordType } from 'src/types/users.types';
import {
  ResponseTemplate,
  TransformInterceptor,
} from 'src/utils/interceptors/transform.interceptor';
import { UserWithoutPassword } from 'src/utils/selector.utils';
import { AuthUser } from '../auth/auth.types';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';
import { UseAuth } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get users' })
  @UseInterceptors(TransformInterceptor)
  async getUsers(
    @Query('page') page?: number,
  ): Promise<ResponseTemplate<PaginatedResult<UserWithoutPasswordType>>> {
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
  ): Promise<ResponseTemplate<UserWithoutPasswordType>> {
    const user = await this.usersService.getUser({ id }, UserWithoutPassword);
    if (!user) throw new NotFoundException(`No user found with id: ${id}`);

    return { message: 'Retrieved user successfully', result: user };
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  @ApiOperation({ summary: 'Update user by id' })
  @UseInterceptors(TransformInterceptor)
  async updateCurrentUser(
    @UseAuth() user: AuthUser,
    @Body() data: UpdateUserDto,
  ): Promise<ResponseTemplate<User>> {
    const updateUser = await this.usersService.updateUser(
      { id: user.sub },
      data,
    );

    return { message: 'Updated user successfully', result: updateUser };
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  @ApiOperation({ summary: 'Delete user by id' })
  @UseInterceptors(TransformInterceptor)
  async deleteCurrentUser(
    @UseAuth() user: AuthUser,
  ): Promise<ResponseTemplate<User>> {
    const deleteUser = await this.usersService.deleteUser({ id: user.sub });

    return { message: 'Deleted user successfully', result: deleteUser };
  }
}
