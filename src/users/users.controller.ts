import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { IsUuid } from 'src/validators/isUuid-validator';
import { CreateUserDto } from './dtos/input/create-user.dto';
import { UpdateUserDto } from './dtos/input/update-user.dto';
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

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param() params: IsUuid, @Body() body: UpdateUserDto) {
    return this.usersService.update({
      id: params.id,
      name: body.name,
      email: body.email,
    });
  }
}
