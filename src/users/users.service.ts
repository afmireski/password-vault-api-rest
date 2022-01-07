import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { userErrors } from 'src/error-codes/100-user-errors';
import { ErrorCodeDto } from 'src/error-codes/error-code.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserPasswordDto } from './dtos/input/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: where,
    });

    if (!user) {
      throw new NotFoundException(new ErrorCodeDto(101, userErrors[101]));
    }

    return user;
  }

  async create(input: Prisma.UserCreateInput): Promise<User> {
    return await Promise.resolve()
      .then(async () => {
        const user = await this.prisma.user.findFirst({
          where: {
            email: input.email,
          },
        });

        if (user) {
          throw new ConflictException(new ErrorCodeDto(108, userErrors[108]));
        }
      })
      .then(() => {
        const salt = bcrypt.genSaltSync(10);
        input.password = bcrypt.hashSync(input.password, salt);

        return this.prisma.user.create({
          data: input,
        });
      })
      .then((createdUser) => {
        return this.prisma.user.findUnique({
          where: {
            id: createdUser.id,
          },
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  async update(input: Prisma.UserUncheckedUpdateInput): Promise<User> {
    return await Promise.resolve(this.findUnique({ id: input.id as string }))
      .then(async () => {
        if (input.email) {
          const user = await this.prisma.user.findFirst({
            where: {
              email: input.email as string,
            },
          });

          if (user) {
            throw new ConflictException(new ErrorCodeDto(108, userErrors[108]));
          }
        }
      })
      .then(() =>
        this.prisma.user.update({
          where: {
            id: input.id as string,
          },
          data: {
            ...input,
            updated_at: new Date(),
          },
        }),
      )
      .then((updatedUser) =>
        this.prisma.user.findUnique({
          where: {
            id: updatedUser.id,
          },
        }),
      )
      .catch((error) => {
        throw error;
      });
  }

  async delete(id: string) {
    return Promise.resolve(this.findUnique({ id: id }))
      .then(() =>
        this.prisma.user.delete({
          where: { id: id },
          select: null,
        }),
      )
      .then(() => undefined)
      .catch((error) => {
        throw error;
      });
  }

  async updatePassword(id: string, input: UpdateUserPasswordDto) {
    return Promise.resolve(this.findUnique({ id: id }))
      .then((user) => {
        if (input.current_password === input.new_password) {
          throw new BadRequestException(new ErrorCodeDto(102, userErrors[102]));
        } else if (input.new_password !== input.confirm_new_password) {
          throw new BadRequestException(new ErrorCodeDto(103, userErrors[103]));
        } else if (!bcrypt.compareSync(input.current_password, user.password)) {
          throw new BadRequestException(new ErrorCodeDto(104, userErrors[104]));
        }

        return this.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            password: bcrypt.hashSync(
              input.new_password,
              bcrypt.genSaltSync(10),
            ),
          },
        });
      })
      .then(() => undefined);
  }
}
