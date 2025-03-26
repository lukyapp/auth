import { Injectable } from '@nestjs/common';
import { AuthenticateUserResponseData } from '../dtos/authenticate-user.response';
import {
  AuthTokenServicePort,
  GenerateAuthTokenByRefreshTokenBody,
} from '../services/auth-token.service.port';

@Injectable()
export class AuthenticateByRefreshTokenUseCase {
  constructor(private readonly authTokenService: AuthTokenServicePort) {}

  async perform(
    body: GenerateAuthTokenByRefreshTokenBody,
  ): Promise<AuthenticateUserResponseData> {
    const { accessToken, refreshToken } =
      await this.authTokenService.generateAuthTokenByRefreshToken(body);

    return {
      userId: 'user.id', // TODO to see
      accessToken,
      refreshToken,
    };
  }
}
