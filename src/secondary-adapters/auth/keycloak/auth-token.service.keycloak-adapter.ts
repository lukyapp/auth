import { Injectable } from '@nestjs/common';
import { UnknownElementException } from '@nestjs/core/errors/exceptions';
import axios, { AxiosInstance } from 'axios';
import {
  AuthTokenResponse,
  AuthTokenServicePort,
  GenerateAuthTokenBody,
  GenerateAuthTokenByRefreshTokenBody,
  LogoutBody,
} from '../../../application/auth/services/auth-token.service.port';
import { KeycloakConfig } from '../../../infrastructure/keycloak/keycloak-config';
import {
  Credentials,
  getToken,
} from '../../../infrastructure/keycloak/utils/get-token';
import { UserRepositoryKeycloakAdapter } from '../../user/keycloak/user-repository.keycloak-adapter';

@Injectable()
export class AuthTokenServiceKeycloakAdapter implements AuthTokenServicePort {
  private client: AxiosInstance;

  constructor(
    private readonly keycloakConfig: KeycloakConfig,
    private readonly userRepositoryKeycloakAdapter: UserRepositoryKeycloakAdapter,
  ) {
    this.client = axios.create({
      baseURL: keycloakConfig.baseUrl,
    });
  }

  private get realmName() {
    return this.keycloakConfig.realmName;
  }

  async generateAuthToken({
    sub,
    email,
  }: GenerateAuthTokenBody): Promise<AuthTokenResponse> {
    try {
      const user = await this.userRepositoryKeycloakAdapter.getUserById(sub);
      if (!user) {
        await this.userRepositoryKeycloakAdapter.createUser({
          email,
          password: email,
        });
      }
      const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
        await this.auth({
          grantType: 'password',
          clientId: this.keycloakConfig.clientId,
          username: email,
          password: email,
        });

      return new AuthTokenResponse({
        accessToken,
        refreshToken,
        expiresIn: Number(expiresIn),
        refreshExpiresIn,
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
      const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
        await this.auth({
          grantType: 'refresh_token',
          clientId: this.keycloakConfig.clientId,
          refreshToken: oldRefreshToken,
        });

      return {
        accessToken,
        refreshToken,
        expiresIn: Number(expiresIn),
        refreshExpiresIn,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new UnknownElementException('Invalid refresh token');
    }
  }

  async logout({ sub }: LogoutBody): Promise<void> {
    await this.client.post<void>(
      `/admin/realms/${this.realmName}/users/${sub}/logout`,
    );
  }

  private async auth(credentials: Credentials) {
    return await getToken({
      baseUrl: this.keycloakConfig.baseUrl,
      realmName: this.keycloakConfig.realmName,
      // scope: this.config.scope,
      credentials,
      // requestOptions: this.config.getRequestOptions(),
    });
  }
}
