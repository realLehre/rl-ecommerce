//
//
// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
//
// import { AppModule } from './app/app.module';
// import { GlobalExceptionFilter } from './app/http-exception.filter';
//
//
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//
//
//   app.useGlobalFilters(new GlobalExceptionFilter());
//
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   app.enableCors({
//     origin: ['http://localhost:4200', 'https://rl-toy-spot.netlify.app'],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//   });
//   const port = process.env['PORT'] || 3000;
//   await app.listen(port);
//   Logger.log(
//     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
//   );
// }
//
// bootstrap();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './app/http-exception.filter';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:4200', 'https://your-netlify-site.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  return app;
}

exports.handler = async (event: any, context: any) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  const response = await server.handleRequest(event.rawBody, context);
  return response;
};
