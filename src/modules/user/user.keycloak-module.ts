import { Module } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/user/services/user.repository.port';
import { KeycloakModule } from '../../infrastructure/keycloak/keycloak.module';
import { UserRepositoryKeycloakAdapter } from '../../secondary-adapters/user/keycloak/user-repository.keycloak-adapter';

@Module({
  imports: [KeycloakModule],
  providers: [
    {
      provide: UserRepositoryPort,
      useExisting: UserRepositoryKeycloakAdapter,
    },
  ],
  exports: [UserRepositoryPort, UserRepositoryKeycloakAdapter],
})
export class UserKeycloakModule {}
