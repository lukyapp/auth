import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../../modules/config/configuration.module';
import { AuthTokenServiceLocalAdapter } from '../../secondary-adapters/auth/local/auth-token.service.local-adapter';

@Module({
  imports: [ConfigurationModule],
  providers: [AuthTokenServiceLocalAdapter],
  exports: [AuthTokenServiceLocalAdapter],
})
export class LocalModule {}
