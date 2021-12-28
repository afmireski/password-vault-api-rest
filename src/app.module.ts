import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
