import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './app.module';
import { ConfigurationServicePort } from './application/config/service/configuration.service.port';
import session from 'express-session';
import crypto from 'crypto';
import { Utils } from './utils/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // variables

  const configurationService = app.get(ConfigurationServicePort);
  const BASE_URL = configurationService.get('BASE_URL');
  const PORT = configurationService.get('PORT');
  const GLOBAL_PREFIX = '';
  const SWAGGER_PATH = `${GLOBAL_PREFIX}/docs`;

  //
  const classSerializerInterceptor = app.get(ClassSerializerInterceptor);
  const validationPipe = app.get(ValidationPipe);
  app.useGlobalInterceptors(classSerializerInterceptor);
  app.useGlobalPipes(validationPipe);

  // db

  const sequelize: Sequelize = app.get(Sequelize);
  await sequelize.sync({
    force: false,
    alter: false,
  });

  // sessions

  app.use(
    session({
      secret: crypto.randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  // swagger

  const SWAGGER_TITLE: string = 'SWAGGER_TITLE';
  const SWAGGER_DESCRIPTION: string = 'SWAGGER_DESCRIPTION';
  const SWAGGER_VERSION: string = 'SWAGGER_VERSION';

  const config = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'userToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);

  // run

  await app.listen(PORT);

  const applicationUrl = Utils.urlJoin(`${BASE_URL}`, GLOBAL_PREFIX);
  const swaggerUiUrl = Utils.urlJoin(
    `${BASE_URL}`,
    GLOBAL_PREFIX,
    SWAGGER_PATH,
  );
  const swaggerJsonFileUrl = Utils.urlJoin(
    `${BASE_URL}`,
    GLOBAL_PREFIX,
    `${SWAGGER_PATH}-json`,
  );

  Logger.log(`🚀 Application is running on: ${applicationUrl.toString()}`);
  Logger.log(`🚀 Swagger UI is server on: ${swaggerUiUrl.toString()}`);
  Logger.log(
    `🚀 Swagger json file is server on: ${swaggerJsonFileUrl.toString()}`,
  );
}

bootstrap().catch((err) => console.log(err));
