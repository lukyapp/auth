import { Module } from '@nestjs/common';
import { AuthTokenServicePort } from '../../application/auth/services/auth-token.service.port';
import { LocalModule } from '../../infrastructure/local/local.module';
import { AuthTokenServiceLocalAdapter } from '../../secondary-adapters/auth/local/auth-token.service.local-adapter';

@Module({
  imports: [LocalModule],
  providers: [
    {
      provide: AuthTokenServicePort,
      useExisting: AuthTokenServiceLocalAdapter,
    },
  ],
  exports: [AuthTokenServicePort],
})
export class AuthLocalModule {}
