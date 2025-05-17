// import compression from '@fastify/compress';
// import fastifyCsrf from '@fastify/csrf-protection';
// import helmet from '@fastify/helmet';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
// import * as fastifyMultipart from 'fastify-multipart';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';

// import cluster from 'cluster';
// import os from 'os';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  // const numCPUs = os.cpus().length;

  // if (cluster.isPrimary) {
  //   // Fork workers
  //   for (let i = 0; i < numCPUs; i++) {
  //     cluster.fork();
  //   }
  //   cluster.on('exit', (worker, code, signal) => {
  //     console.log(`Worker ${worker.process.pid} died`);
  //     // Restart the worker if it exits
  //     cluster.fork();
  //   });
  // } else {

  // const httpsOptions = {
  //   key: readFileSync('ssl/private.pem'),
  //   cert: readFileSync('ssl/certificate.crt'),
  //   ca: readFileSync('ssl/sslca.ca-bundle'),
  // };
  // const app = await NestFactory.create(AppModule/*, { httpsOptions }*/);
  // app.getHttpAdapter().getInstance().server.setMaxListeners(0); // Set maximum listeners to unlimited

  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter({
  //     // https: httpsOptions,
  //   }),
  // );

  const app = await NestFactory.create(AppModule);
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
  // app.use(fastifyMultipart());
  // await app.register(compression);
  // await app.register(helmet);
  // await app.register(fastifyCsrf);
  await app.listen(3111);
  // }
}
bootstrap();
