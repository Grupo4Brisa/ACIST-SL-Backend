import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =========================
  // VALIDATION PIPE GLOBAL
  // =========================
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: false,
    }),
  );

  // =========================
  // SWAGGER CONFIG
  // =========================
  const config = new DocumentBuilder()
    .setTitle('Company API')
    .setDescription('API de Companies, Users, Auth e integrações')
    .setVersion('1.0')

    // 🔐 JWT AUTH NO SWAGGER
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // nome do security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // =========================
  // CORS
  // =========================
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
