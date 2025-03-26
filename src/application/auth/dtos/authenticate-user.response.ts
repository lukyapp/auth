import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Dto } from '../../../domain/common/dto';

export class AuthenticateUserResponseData extends Dto<AuthenticateUserResponseData> {
  @Expose()
  declare userId: string;

  @Expose()
  declare accessToken: string;

  @Expose()
  @IsOptional()
  declare refreshToken?: string;
}
