import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './infrastructure/config/environment-variables';
import session from 'express-session';
import crypto from 'crypto';
import { Utils } from './utils/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // variables

  const configService: ConfigService<EnvironmentVariables, true> =
    app.get(ConfigService);
  const PORT: number = configService.get('PORT');
  const GLOBAL_PREFIX: string = '';
  const SWAGGER_PATH: string = `${GLOBAL_PREFIX}/docs`;

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

  const applicationUrl = Utils.urlJoin(
    `http://localhost:${PORT}`,
    GLOBAL_PREFIX,
  );
  const swaggerUiUrl = Utils.urlJoin(
    `http://localhost:${PORT}`,
    GLOBAL_PREFIX,
    SWAGGER_PATH,
  );
  const swaggerJsonFileUrl = Utils.urlJoin(
    `http://localhost:${PORT}`,
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
