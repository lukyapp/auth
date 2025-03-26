import { Dto } from '../../../domain/common/dto';

export class AuthTokenResponse extends Dto<AuthTokenResponse> {
  declare public readonly accessToken: string;
  declare public readonly refreshToken: string;
  declare public readonly expiresIn: number;
  declare public readonly refreshExpiresIn: number;
}

export class GenerateAuthTokenBody extends Dto<GenerateAuthTokenBody> {
  declare public readonly sub: string;
  declare public readonly email: string;
}

export class GenerateAuthTokenByRefreshTokenBody extends Dto<GenerateAuthTokenByRefreshTokenBody> {
  declare public readonly refreshToken: string;
}

export class LogoutBody extends Dto<LogoutBody> {
  declare public readonly sub: string;
  declare public readonly authorizationHeader: string;
}

export abstract class AuthTokenServicePort {
  abstract generateAuthToken(
    body: GenerateAuthTokenBody,
  ): Promise<AuthTokenResponse> | AuthTokenResponse;

  abstract generateAuthTokenByRefreshToken(
    body: GenerateAuthTokenByRefreshTokenBody,
  ): Promise<AuthTokenResponse> | AuthTokenResponse;

  abstract logout(body: LogoutBody): Promise<void>;
}
