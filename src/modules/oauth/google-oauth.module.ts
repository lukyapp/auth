import { Module } from '@nestjs/common';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { GoogleOauthConfig } from '../../application/oauth/google/google-oauth.config';
import { OauthGuardProxy } from '../../primary-adapters/oauth/oauth-guard.proxy';
import { OauthController } from '../../primary-adapters/oauth/oauth.controller';
import { GoogleOAuthGuard } from '../../primary-adapters/oauth/google/google-oauth.guard';
import { GoogleOauthStrategy } from '../../primary-adapters/oauth/google/google-oauth.strategy';
import { OauthGuard } from '../../primary-adapters/oauth/oauth.guard';
import { Utils } from '../../utils/utils';
import { AuthModule } from '../auth/auth.module';
import { ConfigurationModule } from '../config/configuration.module';
import { ValidationModule } from '../utils/validation.module';

@Module({
  controllers: [OauthController],
  imports: [AuthModule, ConfigurationModule, ValidationModule],
  providers: [
    GoogleOauthStrategy,
    GoogleOAuthGuard,
    OauthGuard,
    OauthGuardProxy,
    {
      provide: GoogleOauthConfig,
      inject: [ConfigurationServicePort],
      useFactory: (configurationService: ConfigurationServicePort) => {
        const baseUrl = configurationService.get('BASE_URL');
        return new GoogleOauthConfig({
          clientID: configurationService.get('OAUTH_GOOGLE_CLIENT_ID'),
          clientSecret: configurationService.get('OAUTH_GOOGLE_CLIENT_SECRET'),
          callbackURL: Utils.urlJoin(baseUrl, '/auth/google/callback'),
          successURL: Utils.urlJoin(baseUrl, '/auth/google/success'),
        });
      },
    },
  ],
})
export class GoogleOauthModule {}
