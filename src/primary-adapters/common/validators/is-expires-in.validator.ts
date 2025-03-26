import { applyDecorators } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';

// @ValidatorConstraint({ async: false })
// class IsExpiresInConstraint implements ValidatorConstraintInterface {
//   validate(value: any) {
//     return typeof value === 'string' && /^\d+[mhdwy]$/.test(value);
//   }
//
//   defaultMessage() {
//     return 'Invalid expiration format. Expected format: {number}{m|h|d|w|y} (e.g., "10m", "2h", "3d")';
//   }
// }

// export function IsExpiresIn(validationOptions?: ValidationOptions) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: IsExpiresInConstraint,
//     });
//   };
// }

export type ExpiresIn =
  | `${number}m`
  | `${number}h`
  | `${number}d`
  | `${number}w`
  | `${number}y`;

export function IsExpiresIn() {
  return applyDecorators(
    IsString(),
    Matches(/^\d+[smhd]$/, {
      message:
        'Invalid expiration format. Expected format: {number}{m|h|d|w|y} (e.g., "10m", "2h", "3d")',
    }),
  );
}
