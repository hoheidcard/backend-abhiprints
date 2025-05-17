import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverless from 'serverless-http';

const server = express();

async function createApp() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  const config = new DocumentBuilder()
    .setTitle('HariOM Server')
    .setDescription('The HariOM server API description')
    .setVersion('1.0')
    .addTag('HariOM Server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();
  app.use(compression());

  await app.init(); // important: initialize without listening
}

await createApp();

export const handler = serverless(server);
