import { Module } from '@nestjs/common';
import { AuthTokenServicePort } from '../../application/auth/services/auth-token.service.port';
import { LocalModule } from '../../infrastructure/local/local.module';
import { AuthTokenServiceKeycloakAdapter } from '../../secondary-adapters/auth/keycloak/auth-token.service.keycloak-adapter';

@Module({
  imports: [LocalModule],
  providers: [
    {
      provide: AuthTokenServicePort,
      useExisting: AuthTokenServiceKeycloakAdapter,
    },
  ],
  exports: [AuthTokenServicePort],
})
export class AuthKeycloakModule {}
