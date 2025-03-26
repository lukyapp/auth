import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  TypeHelpOptions,
  TypeOptions,
} from 'class-transformer/types/interfaces';
import { ValidateNested, ValidationOptions } from 'class-validator';

export function Nested(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  typeFunction: (type?: TypeHelpOptions) => Function,
  validationOptions?: ValidationOptions,
  options?: TypeOptions,
) {
  return applyDecorators(
    Type(typeFunction, options),
    ValidateNested(validationOptions),
  );
}
