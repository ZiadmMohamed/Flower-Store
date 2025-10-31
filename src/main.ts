import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { winstonConfig } from './config/logger/logger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtExceptionFilter } from './common/exception-filters/jwt.exception-filter';
async function bootstrap() {
  const loggerInstance = createLogger(winstonConfig);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({ instance: loggerInstance }),
  });
  app.useGlobalFilters(new JwtExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Flower Store API')
    .setDescription('Flower Store API Description')
    .setVersion('1.0')
    .addTag('flower-store')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(9090);
}
bootstrap();
