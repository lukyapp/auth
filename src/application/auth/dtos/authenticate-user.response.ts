import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Dto } from '../../../domain/common/dto';

export class AuthenticateUserResponseData extends Dto<AuthenticateUserResponseData> {
  @Expose()
  declare public readonly userId: string;

  @Expose()
  declare public readonly accessToken: string;

  @Expose()
  @IsOptional()
  declare public readonly refreshToken?: string;
}
