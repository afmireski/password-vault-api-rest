import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/users/dtos/input/login.dto';
import { userErrors } from 'src/error-codes/100-user-errors';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    return Promise.resolve(this.usersService.findUnique({ email: email }))
      .then((user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          throw new UnauthorizedException({
            code: 107,
            message: userErrors[107],
          });
        }
        return user;
      })
      .then();
  }

  async login(input: LoginDto) {
    const user = await this.validateUser(input.email, input.password);
    return {
      access_token: this.jwtService.sign({ id: user.id }),
      user,
    };
  }
}
