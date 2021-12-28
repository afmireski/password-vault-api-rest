import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.findUnique({
      where: where,
    });
  }

}
