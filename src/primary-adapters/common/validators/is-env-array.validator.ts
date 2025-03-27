import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export function IsEnvArray() {
  return applyDecorators(
    IsArray(),
    ArrayNotEmpty(),
    IsString({ each: true }),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
    ),
  );
}
