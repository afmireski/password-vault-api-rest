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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { userErrors } from 'src/error-codes/100-user-errors';
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

  @ApiParam({
    name: 'id',
    example: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
        name: 'User',
        email: 'user@email.com',
        password: 'hash_password',
        created_at: '2022-01-03T13:31:42.730Z',
        updated_at: '2022-01-03T13:31:42.730Z',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @Get(':id/id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async findUserById(@Param() params: IsUuid): Promise<User> {
    return this.usersService.findUnique({ id: params.id });
  }

  @ApiParam({
    name: 'email',
    example: 'user@email.com',
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
        name: 'User',
        email: 'user@email.com',
        password: 'hash_password',
        created_at: '2022-01-03T13:31:42.730Z',
        updated_at: '2022-01-03T13:31:42.730Z',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @Get(':email/email')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async findUserByEmail(@Param() params: IsEmailValidator): Promise<User> {
    return this.usersService.findUnique({ email: params.email });
  }

  @ApiCreatedResponse({
    schema: {
      example: {
        id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
        name: 'User',
        email: 'user@email.com',
        password: 'hash_password',
        created_at: '2022-01-03T13:31:42.730Z',
        updated_at: '2022-01-03T13:31:42.730Z',
      },
    },
  })
  @ApiConflictResponse({
    schema: {
      example: {
        code: 100,
        message: userErrors[100],
      },
    },
  })
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @ApiParam({
    name: 'id',
    example: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
        name: 'Updated User',
        email: 'updateduser@email.com',
        password: 'hash_password',
        created_at: '2022-01-03T13:31:42.730Z',
        updated_at: '2022-01-03T16:57:08.065Z',
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
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

  @ApiParam({
    name: 'id',
    example: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
  })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: {
        code: 101,
        message: userErrors[101],
      },
    },
  })
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard, IsUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: IsUuid) {
    return this.usersService.delete(params.id);
  }

  @ApiParam({
    name: 'id',
    example: '0adc9fe5-497e-4376-be4e-d7482b91bf03',
  })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
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
