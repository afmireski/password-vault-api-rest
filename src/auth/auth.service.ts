import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    return Promise.resolve(this.usersService.findUnique({ email: email }))
      .then((user) => {
        if (!user && bcrypt.compareSync(password, user.password)) {
          return null;
        }
        return user;
      })
      .then();
  }
}
