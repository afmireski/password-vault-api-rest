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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsEmailValidator } from 'src/validators/isEmail-validator';
import { IsUuid } from 'src/validators/isUuid-validator';
import { CreateUserDto } from './dtos/input/create-user.dto';
import { UpdateUserPasswordDto } from './dtos/input/update-user-password.dto';
import { UpdateUserDto } from './dtos/input/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async findUserById(@Param() params: IsUuid): Promise<User> {
    return this.usersService.findUnique({ id: params.id });
  }

  @Get(':email/email')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async findUserByEmail(@Param() params: IsEmailValidator): Promise<User> {
    return this.usersService.findUnique({ email: params.email });
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsUserGuard)
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
  @UseGuards(JwtAuthGuard, IsUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: IsUuid) {
    return this.usersService.delete(params.id);
  }

  @Post(':id/updatePassword')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, IsUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Param() param: IsUuid,
    @Body() body: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(param.id, body);
  }
}
