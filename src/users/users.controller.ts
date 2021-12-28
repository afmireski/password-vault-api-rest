import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/input/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/id')
  async findUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUnique({ id: id });
  }

  @Get(':email/email')
  async findUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findUnique({ email: email });
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
}
