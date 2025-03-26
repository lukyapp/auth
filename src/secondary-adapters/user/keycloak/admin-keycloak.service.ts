import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { KeycloakConfig } from '../../../infrastructure/keycloak/keycloak-config';
import {
  Credentials,
  getToken,
} from '../../../infrastructure/keycloak/utils/get-token';

@Injectable()
export class AdminKeycloakService implements OnModuleInit {
  private readonly client: AxiosInstance;

  public idToken?: string;
  public tokenType?: string;
  public accessToken?: string;
  public refreshToken?: string;
  public refreshExpiresIn?: number;
  public expiresIn?: number;

  constructor(private readonly keycloakConfig: KeycloakConfig) {
    this.client = axios.create({
      baseURL: keycloakConfig.baseUrl,
      headers: {},
    });
  }

  async onModuleInit() {
    await this.authAdmin();
  }

  private get realmName() {
    return this.keycloakConfig.realmName;
  }

  async authAdmin(): Promise<void> {
    try {
      const {
        accessToken,
        tokenType,
        idToken,
        refreshToken,
        refreshExpiresIn,
        expiresIn,
      } = await this.auth({
        grantType: 'password',
        clientId: this.keycloakConfig.clientId,
        username: this.keycloakConfig.adminUsername,
        password: this.keycloakConfig.adminPassword,
      });
      this.idToken = idToken;
      this.tokenType = tokenType;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.refreshExpiresIn = refreshExpiresIn;
      this.expiresIn = Number(expiresIn);
    } catch (error) {
      console.error('Error when auth admin:', error);
    }
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
