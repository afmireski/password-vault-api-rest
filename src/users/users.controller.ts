import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { IsUuid } from 'src/validators/isUuid-validator';
import { CreateUserDto } from './dtos/input/create-user.dto';
import { LoginDto } from './dtos/input/login.dto';
import { UpdateUserPasswordDto } from './dtos/input/update-user-password.dto';
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

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: IsUuid) {
    return this.usersService.delete(params.id);
  }

  @Post(':id/updatePassword')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Param() param: IsUuid,
    @Body() body: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(param.id, body);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }
}
