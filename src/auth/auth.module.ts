import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './guards/stategy/auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './guards/constants';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './guards/stategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    AuthStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
