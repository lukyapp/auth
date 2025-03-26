import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnknownElementException } from '@nestjs/core/errors/exceptions';
import { JwtService } from '@nestjs/jwt';
import { decodeJwt } from 'jose';
import {
  AuthTokenResponse,
  AuthTokenServicePort,
  GenerateAuthTokenBody,
  GenerateAuthTokenByRefreshTokenBody,
} from '../../../application/auth/services/auth-token.service.port';
import { EnvironmentVariables } from '../../../infrastructure/config/environment-variables';

@Injectable()
export class AuthTokenServiceLocalAdapter implements AuthTokenServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async generateAuthToken({
    sub,
    email,
  }: GenerateAuthTokenBody): Promise<AuthTokenResponse> {
    try {
      const accessToken = await this.jwtService.signAsync({
        sub,
        email,
      });
      const { exp: expiresIn } = decodeJwt(accessToken);
      const refreshToken = await this.jwtService.signAsync(
        {
          sub,
          email,
        },
        {
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        },
      );
      const { exp: refreshExpiresIn } = decodeJwt(refreshToken);

      return new AuthTokenResponse({
        accessToken,
        refreshToken,
        expiresIn: expiresIn!,
        refreshExpiresIn: refreshExpiresIn!,
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw new UnknownElementException(
        'Invalid credentials or authentication failure',
      );
    }
  }

  async generateAuthTokenByRefreshToken({
    refreshToken: oldRefreshToken,
  }: GenerateAuthTokenByRefreshTokenBody): Promise<AuthTokenResponse> {
    try {
      const oldRefreshTokenDecoded = decodeJwt(oldRefreshToken);
      const sub: string = oldRefreshTokenDecoded.sub as unknown as string;
      const email: string = oldRefreshTokenDecoded.email as string;

      return this.generateAuthToken({ sub, email });
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new UnknownElementException('Invalid refresh token');
    }
  }

  async logout(): Promise<void> {}
}
