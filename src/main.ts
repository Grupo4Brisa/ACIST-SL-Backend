import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({transform: true, whitelist: true, forbidNonWhitelisted: true, transformOptions: {enableImplicitConversion: true,
    },
    stopAtFirstError: false,
  }),
);

  const config = new DocumentBuilder()
    .setTitle('Company API')
    .setDescription('API de Companies, Solutions e relações')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(); // opcional, mas recomendado

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
