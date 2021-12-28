import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/id')
  findUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUnique({ id: id });
  }

  @Get(':email/email')
  findUserByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findUnique({ email: email });
  }
}
