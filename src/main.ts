import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_API_ROOT } from './common/constants';
import { AppName } from './common/constants/const';
import { TransformResponseInterceptor } from './common/interceptors/response.interceptor';
import { ErrorResponse } from './common/filter/error-response';
const logger = new Logger(AppName);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ErrorResponse());

  app.enableCors({
    exposedHeaders: ['Content-Disposition'],
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Metric tracking systems')
    .setDescription('API documentation for Metric tracking systems')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  await app.listen(process.env.APP_PORT || 3000);
  const url = await app.getUrl();
  logger.verbose(`Application is running on: ${url}`);
}
bootstrap();
