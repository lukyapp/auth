import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth as SwaggerApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Dto } from '../../../domain/common/dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

export class ApiUnauthorizedResponseErrorBody extends Dto<ApiUnauthorizedResponseErrorBody> {
  public readonly message: string = 'Unauthorized';
  public readonly error?: string = 'Unauthorized';
  public readonly statusCode: number = HttpStatus.UNAUTHORIZED;
}

export function ApiBearerAuth() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      type: ApiUnauthorizedResponseErrorBody,
    }),
    SwaggerApiBearerAuth('userToken'),
    UseGuards(JwtAuthGuard),
  );
}
