import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { userErrors } from 'src/error-codes/100-user-errors';
import { LoginDto } from 'src/users/dtos/input/login.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    schema: {
      example: {
        access_token: 'access_token',
        user: {
          id: '76bb7e5d-7c24-4293-a696-328d4bcf94c9',
          name: 'User',
          email: 'user@email.com',
          password: 'hash_password',
          created_at: '2022-01-03T12:56:27.609Z',
          updated_at: '2022-01-03T12:56:27.606Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        code: 107,
        message: userErrors[107],
      },
    },
  })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
