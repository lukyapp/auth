import { Injectable } from '@nestjs/common';
import { AuthTokenServicePort } from '../services/auth-token.service.port';
import { AuthenticateUserResponseData } from '../dtos/authenticate-user.response';
import { AuthenticatorStrategy } from '../services/authenticator/authenticator.strategy';

@Injectable()
export class AuthenticateUseCase {
  constructor(private readonly authTokenService: AuthTokenServicePort) {}

  async perform<
    TBody,
    TAuthenticatorStrategy extends AuthenticatorStrategy<TBody>,
  >(
    authenticatorStrategy: TAuthenticatorStrategy,
    body: TBody,
  ): Promise<AuthenticateUserResponseData> {
    const user = await authenticatorStrategy.authenticate(body);

    const { accessToken, refreshToken } =
      await this.authTokenService.generateAuthToken({
        sub: user.id,
        email: user.email,
      });

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }
}
