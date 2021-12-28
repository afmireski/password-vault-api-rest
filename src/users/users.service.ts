import { ConflictException, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { userErrors } from 'src/error-codes/100-user-errors';

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
}
