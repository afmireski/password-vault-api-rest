import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(body: any): Promise<User> {
    return Promise.resolve(
      this.authService.validateUser(body.email, body.password),
    )
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }

        return user;
      })
      .then();
  }
}
