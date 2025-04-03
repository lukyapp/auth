import {
  BadRequestException,
  Logger,
  Module,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';
import { ValidationError } from 'class-validator';
import { ValidationService } from '../../infrastructure/utils/validation.service';

@Module({
  controllers: [],
  imports: [],
  providers: [
    ValidationService,
    {
      provide: 'ClassSerializerInterceptorOptions',
      useFactory: (): ClassSerializerInterceptorOptions => {
        return {
          excludeExtraneousValues: true,
        };
      },
    },
    {
      provide: 'ValidationPipeOptions',
      useFactory: (): ValidationPipeOptions => {
        // TODO isProductionMode
        const isProductionMode = false;
        const logger = new Logger('ValidationPipeOptions');
        return {
          whitelist: true, // supprime automatiquement toutes les propriétés qui n'ont pas de décorateurs définis dans le DTO
          disableErrorMessages: isProductionMode, // Désactiver les messages d'erreur détaillés
          transform: true, // transforme automatiquement les objets simples en instances de leur classe
          transformOptions: { enableImplicitConversion: true },
          exceptionFactory: (errors) => {
            const errorsForResponse = flattenValidationErrors(errors);
            logger.error(errorsForResponse);
            return new BadRequestException(errorsForResponse);
          },
        };
      },
    },
  ],
  exports: [
    'ClassSerializerInterceptorOptions',
    'ValidationPipeOptions',
    ValidationService,
  ],
})
export class ValidationModule {}

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
