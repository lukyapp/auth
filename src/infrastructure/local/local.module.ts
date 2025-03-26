import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthTokenServiceLocalAdapter } from '../../secondary-adapters/auth/local/auth-token.service.local-adapter';

@Module({
  imports: [ConfigModule],
  providers: [AuthTokenServiceLocalAdapter],
  exports: [AuthTokenServiceLocalAdapter],
})
export class LocalModule {}
