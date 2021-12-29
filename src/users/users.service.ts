import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { userErrors } from 'src/error-codes/100-user-errors';
import { UpdateUserPasswordDto } from './dtos/input/update-user-password.dto';
import { LoginDto } from './dtos/input/login.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.findUnique({
      where: where,
    });
  }

  async create(input: Prisma.UserCreateInput): Promise<User> {
    return await Promise.resolve()
      .then(async () => {
        const user = await this.findUnique({ email: input.email });

        if (user) {
          throw new ConflictException({
            code: 100,
            message: userErrors[100],
          });
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
    return await Promise.resolve()
      .then(async () => {
        const user = await this.findUnique({ id: input.id as string });

        if (!user) {
          throw new BadRequestException({
            code: 101,
            message: userErrors[101],
          });
        }
      })
      .then(async () => {
        if (input.email) {
          const user = await this.findUnique({ email: input.email as string });

          if (user) {
            throw new BadRequestException({
              code: 100,
              message: userErrors[100],
            });
          }
        }
      })
      .then(() =>
        this.prisma.user.update({
          where: {
            id: input.id as string,
          },
          data: {
            name: input.name,
            email: input.email,
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
      .then((user) => {
        if (!user) {
          throw new BadRequestException({
            code: 101,
            message: userErrors[101],
          });
        }

        return this.prisma.user.delete({
          where: { id: id },
          select: null,
        });
      })
      .then(() => undefined)
      .catch((error) => {
        throw error;
      });
  }

  async updatePassword(id: string, input: UpdateUserPasswordDto) {
    return Promise.resolve(this.findUnique({ id: id }))
      .then((user) => {
        if (!user) {
          throw new BadRequestException({
            code: 101,
            message: userErrors[101],
          });
        }
        if (input.current_password === input.new_password) {
          throw new BadRequestException({
            code: 102,
            message: userErrors[102],
          });
        } else if (input.new_password !== input.confirm_new_password) {
          throw new BadRequestException({
            code: 103,
            message: userErrors[103],
          });
        } else if (!bcrypt.compareSync(input.current_password, user.password)) {
          throw new BadRequestException({
            code: 104,
            message: userErrors[104],
          });
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

  // async login(input: LoginDto) {
  //   return Promise.resolve(this.findUnique({ email: input.email })).then(
  //     (user) => {
  //       if (!user) {
  //         throw new BadRequestException({
  //           code: 106,
  //           message: userErrors[106],
  //         });
  //       }
  //       if (!bcrypt.compareSync(input.password, user.password)) {
  //         throw new BadRequestException({
  //           code: 105,
  //           message: userErrors[105],
  //         });
  //       }

  //       return user;
  //     },
  //   );
  // }
}
