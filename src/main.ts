import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('password-vault/api-rest');

  const docConfig = new DocumentBuilder()
    .setTitle('PasswordVault API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('password-vault/api-rest/api', app, document);

  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}
bootstrap();
