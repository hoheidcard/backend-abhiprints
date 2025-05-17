import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import * as compression from 'compression';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Swagger API Docs Setup
  const config = new DocumentBuilder()
    .setTitle('HariOM Server')
    .setDescription('The HariOM server API description')
    .setVersion('1.0')
    .addTag('HariOM Server')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Global Configurations
  // app.setGlobalPrefix('api/v1');
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();
  app.use(compression());

  await app.init();
}

bootstrap();

// Export `server` for Vercel handling
export default server;
