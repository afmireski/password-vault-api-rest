import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
