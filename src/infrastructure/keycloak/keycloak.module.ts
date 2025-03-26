import { Module } from '@nestjs/common';
import { AuthTokenServiceKeycloakAdapter } from '../../secondary-adapters/auth/keycloak/auth-token.service.keycloak-adapter';
import { AdminKeycloakService } from '../../secondary-adapters/user/keycloak/admin-keycloak.service';
import { UserRepositoryKeycloakAdapter } from '../../secondary-adapters/user/keycloak/user-repository.keycloak-adapter';
import { KeycloakConfig } from './keycloak-config';

@Module({
  imports: [],
  providers: [
    {
      provide: KeycloakConfig,
      useValue: new KeycloakConfig({
        adminPassword: 'admin',
        adminUsername: 'admin',
        baseUrl: 'http://localhost:8081',
        clientId: 'admin-cli',
        clientSecret: '',
        grantType: 'password',
        realmName: 'master',
      }),
    },
    UserRepositoryKeycloakAdapter,
    AuthTokenServiceKeycloakAdapter,
    AdminKeycloakService,
  ],
  exports: [
    KeycloakConfig,
    UserRepositoryKeycloakAdapter,
    AuthTokenServiceKeycloakAdapter,
    AdminKeycloakService,
  ],
})
export class KeycloakModule {}
