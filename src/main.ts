import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import * as config from 'config';
import { entryPoint } from './common/constants';

async function bootstrap() {
  const port = process.env.PORT || config.get('server.port');
  const logger = new Logger('bootsrap');

  const whitelist = [config.get('frontend')];
  const corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };

  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Merchant Service Documentation')
    .setDescription('Service API list')
    .setVersion('1.0')
    .addTag('Merchant Service')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${entryPoint}/docs`, app, document);
  await app.listen(port);
  logger.log(`Applicaiton running on port ${port}`);
}
bootstrap();
