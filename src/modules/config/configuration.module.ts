import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { ConfigurationServiceEnvAdapter } from '../../infrastructure/config/configuration.service.env-adapter';
import { validate } from '../../infrastructure/config/env.validation';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      validate,
      expandVariables: true,
    }),
  ],
  providers: [
    {
      provide: ConfigurationServicePort,
      useClass: ConfigurationServiceEnvAdapter,
    },
  ],
  exports: [ConfigurationServicePort],
})
export class ConfigurationModule {}
