import CredentialRepresentation from '@keycloak/keycloak-admin-client/lib/defs/credentialRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import {
  CreateUserBody,
  GetAllUsersBody,
  GetOneUserBody,
  UpdateUserBody,
  UserRepositoryPort,
} from '../../../application/user/services/user.repository.port';
import { User } from '../../../domain/user/user.dto';
import { KeycloakConfig } from '../../../infrastructure/keycloak/keycloak-config';
import { AdminKeycloakService } from './admin-keycloak.service';

@Injectable()
export class UserRepositoryKeycloakAdapter implements UserRepositoryPort {
  private readonly client: AxiosInstance;

  constructor(
    private readonly keycloakConfig: KeycloakConfig,
    private readonly adminKeycloakService: AdminKeycloakService,
  ) {
    this.client = axios.create({
      baseURL: keycloakConfig.baseUrl,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private get realmName() {
    return this.keycloakConfig.realmName;
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { accessToken, tokenType } = this.adminKeycloakService;
      const response = await this.client.get<UserRepresentation>(
        `/admin/realms/${this.realmName}/users/${id}`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        },
      );
      const user = response.data;
      return this.mapToDomain(user);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      console.error('Error fetching user by ID');
      return null;
    }
  }

  async createUser({ email, password }: CreateUserBody): Promise<User> {
    try {
      const { accessToken, tokenType } = this.adminKeycloakService;
      const response = await this.client.post<
        object,
        AxiosResponse<object>,
        UserRepresentation
      >(
        `/admin/realms/${this.realmName}/users/`,
        {
          email,
          username: email,
          enabled: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        },
      );

      const locationHeader: string = response.headers.location as string;
      const userId = locationHeader.split('/').pop(); // Extraire l'ID depuis l'URL

      return this.mapToDomain({
        id: userId,
        email: email,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      console.error('Failed to create user');
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(
    id: string,
    { email, password }: UpdateUserBody,
  ): Promise<User | null> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        return null;
      }

      const keycloakBody: UserRepresentation = {};
      const credentials: CredentialRepresentation[] = [];

      if (email) {
        keycloakBody.email = email;
        keycloakBody.username = email;
      }
      if (password) {
        credentials.push({
          type: 'password',
          value: password,
          temporary: false,
        });
      }
      keycloakBody.credentials = credentials;

      const { accessToken, tokenType } = this.adminKeycloakService;
      await this.client.put<void, AxiosResponse<void>, UserRepresentation>(
        `/admin/realms/${this.realmName}/users/${id}`,
        keycloakBody,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        },
      );

      return this.mapToDomain({
        id,
        email,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { accessToken, tokenType } = this.adminKeycloakService;
      await this.client.delete<void>(
        `/admin/realms/${this.realmName}/users/${id}`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        },
      );
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      console.error('Failed to create user');
      return false;
    }
  }

  async getAllUsers({ page, limit }: GetAllUsersBody): Promise<User[]> {
    try {
      const { accessToken, tokenType } = this.adminKeycloakService;
      const response = await this.client.get<UserRepresentation[]>(
        `/admin/realms/${this.realmName}/users`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
          params: {
            first: (page - 1) * limit,
            max: limit,
          },
        },
      );
      const users = response.data;
      return users.map((user) => this.mapToDomain(user));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      console.error('Failed to fetch all users');
      return [];
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { accessToken, tokenType } = this.adminKeycloakService;
      const response = await this.client.get<UserRepresentation[]>(
        `/admin/realms/${this.realmName}/users`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
          params: {
            email,
          },
        },
      );
      const users = response.data;
      return this.mapToDomain(users[0]);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      console.error('Failed to fetch user by email');
      return null;
    }
  }

  async getOneUser({ email, id }: GetOneUserBody): Promise<User | null> {
    try {
      const { accessToken, tokenType } = this.adminKeycloakService;
      const response = await this.client.get<UserRepresentation[]>(
        `/admin/realms/${this.realmName}/users`,
        {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
          params: {
            email,
            id,
          },
        },
      );
      const users = response.data;
      return this.mapToDomain(users[0]);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log({
          name: error.name,
          message: error.message,
          status: error.status,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          url: error.config?.url,
          body: error.config?.data as unknown,
          headers: error.config?.headers,
        });
      }
      console.error('Failed to fetch user by email');
      return null;
    }
  }

  private mapToDomain(user: UserRepresentation): User;
  private mapToDomain(user: undefined): null;
  private mapToDomain(user: null): null;
  private mapToDomain(user: undefined | null): null;
  private mapToDomain(user: UserRepresentation | undefined | null): User | null;
  private mapToDomain(
    user: UserRepresentation | undefined | null,
  ): User | null {
    if (!user) {
      return null;
    }
    if (!user.id || !user.email) {
      throw new InternalServerErrorException();
    }
    // @ts-expect-error UserRepresentation mapToDomain
    return new User(user);
  }
}
