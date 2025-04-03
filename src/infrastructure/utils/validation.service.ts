import {
  BadRequestException,
  Inject,
  Injectable,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { validateSync } from 'class-validator';

@Injectable()
export class ValidationService {
  constructor(
    @Inject('ClassSerializerInterceptorOptions')
    private readonly classSerializerInterceptorOptions: ClassSerializerInterceptorOptions,
    @Inject('ValidationPipeOptions')
    private readonly validationPipeOptions: ValidationPipeOptions,
  ) {}

  validate<T extends object, V>(cls: ClassConstructor<T>, plain: V) {
    const params = plainToInstance(
      cls,
      plain,
      this.classSerializerInterceptorOptions,
    );
    const errors = validateSync(params, this.validationPipeOptions);
    if (errors.length > 0) {
      console.error(
        errors.map(({ property, value, constraints }) => {
          return {
            property,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value,
            constraints,
          };
        }),
      );
      throw new BadRequestException();
    }
    return params;
  }
}
