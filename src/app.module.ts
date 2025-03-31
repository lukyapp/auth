import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { JwksModule } from './modules/jwks/jwks.module';
import { MyJwtModule } from './modules/jwt/my-jwt.module';
import { GoogleOauthModule } from './modules/oauth/google-oauth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MyJwtModule,
    GoogleOauthModule,
    UserModule,
    AuthModule,
    JwksModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: ClassSerializerInterceptor,
      inject: [Reflector],
      useFactory: (reflector) => {
        return new ClassSerializerInterceptor(reflector, {
          excludeExtraneousValues: true,
        });
      },
    },
    {
      provide: ValidationPipe,
      inject: [],
      useFactory: () => {
        const isProductionMode = false;
        const logger = new Logger('ValidationPipe');
        return new ValidationPipe({
          whitelist: true, // supprime automatiquement toutes les propriétés qui n'ont pas de décorateurs définis dans le DTO
          disableErrorMessages: isProductionMode, // Désactiver les messages d'erreur détaillés
          transform: true, // transforme automatiquement les objets simples en instances de leur classe
          transformOptions: { enableImplicitConversion: true },
          exceptionFactory: (errors) => {
            const errorsForResponse = flattenValidationErrors(errors);
            logger.error(errorsForResponse);
            return new BadRequestException(errorsForResponse);
          },
        });
      },
    },
  ],
})
export class AppModule {}

function flattenValidationErrors(validationErrors: ValidationError[]): any[] {
  const result: {
    property: string;
    value: string;
    constraints?: string[];
  }[] = [];

  function processNode(node: ValidationError, parentNode?: ValidationError) {
    const entry = {
      property: parentNode
        ? [parentNode.property, node.property].join('.')
        : node.property,
      constraints: node.constraints ? Object.values(node.constraints) : [],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value: node.value,
    };
    if (entry.constraints.length) {
      result.push(entry);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => processNode(child, node));
    }
  }

  validationErrors.forEach((validationError) => processNode(validationError));
  return result;
}
